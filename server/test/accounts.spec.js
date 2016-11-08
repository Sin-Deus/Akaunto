process.env.NODE_ENV = 'test';

let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
let server = require('../server');
let Account = require('../app/models/Account');
let User = require('../app/models/User');
let should = chai.should();
let Q = require('q');
let moment = require('moment');

chai.use(chaiHttp);

describe('Operations', () => {
    let user1;
    let user2;
    let user3;
    let token1;
    let token2;
    let token3;
    let account1;
    let account2;
    let account3;

    before(() => Q.all([
        new User({
                email: 'admin@test.com',
                password: 'p@ssw0rd',
                isAdmin: true
            })
            .save()
            .then(user => user1 = user),
        new User({
            email: 'user@test.com',
            password: 'p@ssw0rd',
            isAdmin: false
        })
            .save()
            .then(user => user2 = user),
        new User({
            email: 'user3@test.com',
            password: 'p@ssw0rd',
            isAdmin: false
        })
            .save()
            .then(user => user3 = user)
    ]));

    before(() => Q.all([
        new Account({
                name: 'Test Account',
                creator: user1._id
            })
            .save()
            .then(account => account1 = account),
        new Account({
            name: 'Test Account 2',
            creator: user2._id
        })
            .save()
            .then(account => account2 = account),
        new Account({
            name: 'Shared Test Account 3',
            creator: user2._id,
            users: [ user1._id ]
        })
            .save()
            .then(account => account3 = account)
    ]));

    before(done => {
        chai.request(server)
            .post('/authenticate')
            .send({ email: 'admin@test.com', password: 'p@ssw0rd' })
            .end((err, res) => {
                token1 = res.body.token;
                done();
            });
    });

    before(done => {
        chai.request(server)
            .post('/authenticate')
            .send({ email: 'user@test.com', password: 'p@ssw0rd' })
            .end((err, res) => {
                token2 = res.body.token;
                done();
            });
    });

    before(done => {
        chai.request(server)
            .post('/authenticate')
            .send({ email: 'user3@test.com', password: 'p@ssw0rd' })
            .end((err, res) => {
                token3 = res.body.token;
                done();
            });
    });

    after(() => User.remove({}).exec());
    after(() => Account.remove({}).exec());

    describe('GET /accounts/', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .get(`/api/accounts/`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    done();
                });
        });

        describe('authenticated', () => {
            it('should return the list of accounts for user 1', done => {
                chai.request(server)
                    .get(`/api/accounts/`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(2);
                        expect(res.body[0].name).to.be.equal('Shared Test Account 3');
                        expect(res.body[0]._id).to.be.equal(account3._id.toString());
                        expect(res.body[1].name).to.be.equal('Test Account');
                        expect(res.body[1]._id).to.be.equal(account1._id.toString());
                        done();
                    });
            });

            it('should return the list of accounts for user 2', done => {
                chai.request(server)
                    .get(`/api/accounts/`)
                    .set('x-access-token', token2)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(2);
                        expect(res.body[0].name).to.be.equal('Shared Test Account 3');
                        expect(res.body[0]._id).to.be.equal(account3._id.toString());
                        expect(res.body[1].name).to.be.equal('Test Account 2');
                        expect(res.body[1]._id).to.be.equal(account2._id.toString());
                        done();
                    });
            });

            it('should return the list of accounts for user 3', done => {
                chai.request(server)
                    .get(`/api/accounts/`)
                    .set('x-access-token', token3)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(0);
                        done();
                    });
            });
        });
    });

    describe('GET /accounts/:id', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .get(`/api/accounts/5808e3f676c536002176f467`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    done();
                });
        });

        describe('authenticated', () => {
            it('should not find an invalid account', done => {
                chai.request(server)
                    .get(`/api/accounts/5808e3f676c536002176f467`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should return the account for its creator', done => {
                chai.request(server)
                    .get(`/api/accounts/${ account1._id }`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.name).to.be.equal('Test Account');
                        expect(res.body._id).to.be.equal(account1._id.toString());
                        done();
                    });
            });

            it('should not return the account for an unknown user', done => {
                chai.request(server)
                    .get(`/api/accounts/${ account1._id }`)
                    .set('x-access-token', token3)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should return the account for a shared user', done => {
                chai.request(server)
                    .get(`/api/accounts/${ account3._id }`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.name).to.be.equal('Shared Test Account 3');
                        expect(res.body._id).to.be.equal(account3._id.toString());
                        done();
                    });
            });
        });
    });

    describe('POST /accounts/', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .post(`/api/accounts/`)
                .send({ name: 'New account' })
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);

                    Account.findOne({ name: 'New account' })
                        .exec()
                        .then(account => {
                            expect(account).to.be.a('null');
                            done();
                        })
                        .fail(err => console.log(err));
                });
        });

        describe('authenticated', () => {
            afterEach(() => Account.remove({ name: /^New.*/ }).exec());

            it('should create a new account', done => {
                chai.request(server)
                    .post(`/api/accounts/`)
                    .set('x-access-token', token1)
                    .send({ name: 'New account 1', initialBalance: 40 })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body.name).to.be.equal('New account 1');
                        expect(res.body.initialBalance).to.be.equal(40);
                        expect(res.body.creator).to.be.equal(user1._id.toString());
                        expect(res.body.users).to.be.an('array');
                        expect(res.body.users).to.be.empty;

                        Account.findOne({ name: 'New account 1' })
                            .exec()
                            .then(account => {
                                expect(account).to.be.an('object');
                                expect(account.name).to.be.equal('New account 1');
                                expect(account.initialBalance).to.be.equal(40);
                                expect(account.creator.toString()).to.be.equal(user1._id.toString());
                                expect(account.users).to.be.an('array');
                                expect(account.users).to.be.empty;
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });

            it('should create a new shared account', done => {
                chai.request(server)
                    .post(`/api/accounts/`)
                    .set('x-access-token', token2)
                    .send({ name: 'New account 2', currentBalance: 150, currency: 'EURO', users: [ user3._id ] })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body.name).to.be.equal('New account 2');
                        expect(res.body.currentBalance).to.be.equal(150);
                        expect(res.body.currency).to.be.equal('EURO');
                        expect(res.body.users).to.be.an('array');
                        expect(res.body.users.length).to.be.equal(1);
                        expect(res.body.users[0]).to.be.equal(user3._id.toString());
                        expect(res.body.creator).to.be.equal(user2._id.toString());

                        Account.findOne({ name: 'New account 2' })
                            .exec()
                            .then(account => {
                                expect(account).to.be.an('object');
                                expect(account.name).to.be.equal('New account 2');
                                expect(account.currentBalance).to.be.equal(150);
                                expect(account.currency).to.be.equal('EURO');
                                expect(account.users).to.be.an('array');
                                expect(account.users.length).to.be.equal(1);
                                expect(account.users[0].toString()).to.be.equal(user3._id.toString());
                                expect(account.creator.toString()).to.be.equal(user2._id.toString());
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });

            it('should fail to create a new account with missing fields', done => {
                chai.request(server)
                    .post(`/api/accounts/`)
                    .set('x-access-token', token1)
                    .send({ initialBalance: 8000 })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(400);
                        expect(res.body).to.be.empty;

                        Account.findOne({ initialBalance: 8000 })
                            .exec()
                            .then(account => {
                                expect(account).to.be.a('null');
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });
        });
    });

    describe('PUT /accounts/', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .put(`/api/accounts/${ account1._id }`)
                .send({ name: 'New account' })
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);

                    Account.findOne({ name: 'New account' })
                        .exec()
                        .then(account => {
                            expect(account).to.be.a('null');
                            done();
                        })
                        .fail(err => console.log(err));
                });
        });

        describe('authenticated', () => {
            let account4;
            let account5;
            let account6;

            beforeEach(() => Q.all([
                new Account({
                    name: 'Account to update',
                    initialBalance: 0,
                    creator: user1._id
                })
                    .save()
                    .then(account => account4 = account),
                new Account({
                    name: 'Account to update 2',
                    creator: user2._id
                })
                    .save()
                    .then(account => account5 = account),
                new Account({
                    name: 'Shared Account to update',
                    creator: user2._id,
                    users: [ user1._id ]
                })
                    .save()
                    .then(account => account6 = account)
            ]));

            afterEach(() => Q.all([ account4.remove(), account5.remove(), account6.remove() ]));

            it('should not find an inexisting account', done => {
                chai.request(server)
                    .put(`/api/accounts/5808e3f676c536002176f467`)
                    .set('x-access-token', token1)
                    .send({ name: 'Account updated', initialBalance: 10 })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should update an existing account, by its creator', done => {
                chai.request(server)
                    .put(`/api/accounts/${ account4._id }`)
                    .set('x-access-token', token1)
                    .send({ name: 'Account updated', initialBalance: 10 })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.name).to.be.equal('Account updated');
                        expect(res.body._id.toString()).to.be.equal(account4._id.toString());
                        expect(res.body.initialBalance).to.be.equal(10);
                        expect(res.body.creator).to.be.equal(user1._id.toString());
                        expect(res.body.users).to.be.an('array');
                        expect(res.body.users).to.be.empty;

                        Account.findById(account4._id)
                            .exec()
                            .then(account => {
                                expect(account).to.be.an('object');
                                expect(account.name).to.be.equal('Account updated');
                                expect(account._id.toString()).to.be.equal(account4._id.toString());
                                expect(account.initialBalance).to.be.equal(10);
                                expect(account.creator.toString()).to.be.equal(user1._id.toString());
                                expect(account.users).to.be.an('array');
                                expect(account.users).to.be.empty;
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });

            it('should not update an existing account, by a shared user', done => {
                chai.request(server)
                    .put(`/api/accounts/${ account6._id }`)
                    .set('x-access-token', token1)
                    .send({ name: 'Shared account updated' })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;

                        Account.findById(account6._id)
                            .exec()
                            .then(account => {
                                expect(account).to.be.an('object');
                                expect(account.name).to.be.equal('Shared Account to update');
                                expect(account._id.toString()).to.be.equal(account6._id.toString());
                                expect(account.creator.toString()).to.be.equal(user2._id.toString());
                                expect(account.users).to.be.an('array');
                                expect(account.users.length).to.be.equal(1);
                                expect(account.users[0].toString()).to.be.equal(user1._id.toString());
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });

            it('should not update an account of another user', done => {
                chai.request(server)
                    .put(`/api/accounts/${ account4._id }`)
                    .set('x-access-token', token3)
                    .send({ name: 'New account updated', currentBalance: 150, currency: 'EURO', users: [ user3._id ] })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;

                        Account.findById(account4._id)
                            .exec()
                            .then(account => {
                                expect(account).to.be.an('object');
                                expect(account.name).to.be.equal('Account to update');
                                expect(account._id.toString()).to.be.equal(account4._id.toString());
                                expect(account.initialBalance).to.be.equal(0);
                                expect(account.creator.toString()).to.be.equal(user1._id.toString());
                                expect(account.users).to.be.an('array');
                                expect(account.users).to.be.empty;
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });

            it('should not update the creator of an account', done => {
                chai.request(server)
                    .put(`/api/accounts/${ account5._id }`)
                    .set('x-access-token', token2)
                    .send({ currentBalance: 150, currency: 'EUR', users: [ user3._id ], creator: user1._id })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body.name).to.be.equal('Account to update 2');
                        expect(res.body.currentBalance).to.be.equal(150);
                        expect(res.body.currency).to.be.equal('EUR');
                        expect(res.body._id.toString()).to.be.equal(account5._id.toString());
                        expect(res.body.creator).to.be.equal(user2._id.toString());
                        expect(res.body.users).to.be.an('array');
                        expect(res.body.users.length).to.be.equal(1);
                        expect(res.body.users[0]).to.be.equal(user3._id.toString());

                        Account.findById(account5._id)
                            .exec()
                            .then(account => {
                                expect(account).to.be.an('object');
                                expect(account.name).to.be.equal('Account to update 2');
                                expect(account.currentBalance).to.be.equal(150);
                                expect(account.currency).to.be.equal('EUR');
                                expect(account._id.toString()).to.be.equal(account5._id.toString());
                                expect(account.creator.toString()).to.be.equal(user2._id.toString());
                                expect(account.users).to.be.an('array');
                                expect(account.users.length).to.be.equal(1);
                                expect(account.users[0].toString()).to.be.equal(user3._id.toString());
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });
        });
    });

    describe('DELETE /accounts/', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .delete(`/api/accounts/${ account1._id }`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);

                    Account.findById(account1._id)
                        .exec()
                        .then(account => {
                            expect(account).to.be.an('object');
                            done();
                        })
                        .fail(err => console.log(err));
                });
        });

        describe('authenticated', () => {
            let account4;
            let account5;
            let account6;

            beforeEach(() => Q.all([
                new Account({
                    name: 'Account to delete',
                    initialBalance: 0,
                    creator: user1._id
                })
                    .save()
                    .then(account => account4 = account),
                new Account({
                    name: 'Account to delete 2',
                    creator: user2._id
                })
                    .save()
                    .then(account => account5 = account),
                new Account({
                    name: 'Shared Account to delete',
                    creator: user2._id,
                    users: [user1._id]
                })
                    .save()
                    .then(account => account6 = account)
            ]));

            afterEach(() => Q.all([account4.remove(), account5.remove(), account6.remove()]));

            it('should not delete an inexisting account', done => {
                chai.request(server)
                    .delete(`/api/accounts/5808e3f676c536002176f467`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should delete an account by its creator', done => {
                chai.request(server)
                    .delete(`/api/accounts/${ account4._id }`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(204);
                        expect(res.body).to.be.empty;

                        Account.findById(account4._id)
                            .exec()
                            .then(account => {
                                expect(account).to.be.a('null');
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });

            it('should not delete an account by another user', done => {
                chai.request(server)
                    .delete(`/api/accounts/${ account4._id }`)
                    .set('x-access-token', token2)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;

                        Account.findById(account4._id)
                            .exec()
                            .then(account => {
                                expect(account).to.be.an('object');
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });

            it('should not delete an account by a shared user', done => {
                chai.request(server)
                    .delete(`/api/accounts/${ account6._id }`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;

                        Account.findById(account6._id)
                            .exec()
                            .then(account => {
                                expect(account).to.be.an('object');
                                done();
                            })
                            .fail(err => console.log(err));
                    });
            });
        });
    });
});
