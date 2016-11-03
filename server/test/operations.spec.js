process.env.NODE_ENV = 'test';

let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
let server = require('../server');
let Account = require('../app/models/Account');
let User = require('../app/models/User');
let Operation = require('../app/models/Operation');
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
            name: 'Test Account 2',
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

    before(() => {
        let promises = [];

        for (let i = 0; i < 100; ++i) {
            promises.push(
                new Operation({
                    description: `My operation ${ i }`,
                    amount: Math.floor(Math.random() * 100),
                    date: moment('2016-12-31').subtract(i, 'day'),
                    creator: user1._id,
                    account: account1._id
                }).save()
            );

            promises.push(
                new Operation({
                    description: `My second operation ${ i }`,
                    amount: Math.floor(Math.random() * 100),
                    date: moment('2016-08-31').add(i, 'day'),
                    creator: user2._id,
                    account: account2._id
                }).save()
            );

            promises.push(
                new Operation({
                    description: `My third operation ${ i }`,
                    amount: Math.floor(Math.random() * 100),
                    date: moment('2016-01-01').add(i, 'day'),
                    creator: user1._id,
                    account: account3._id
                }).save()
            );
            promises.push(
                new Operation({
                    description: `My third operation ${ i }`,
                    amount: Math.floor(Math.random() * 100),
                    date: moment('2016-02-01').add(i, 'day'),
                    creator: user2._id,
                    account: account3._id
                }).save()
            );
        }

        return Q.all(promises);
    });

    after(() => User.remove({}).exec());
    after(() => Operation.remove({}).exec());
    after(() => Account.remove({}).exec());

    describe('GET /accounts/:id/operations', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .get(`/api/accounts/${ account1._id }/operations`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    done();
                });
        });

        describe('authenticated', () => {
            it('should return the list of operations', done => {
                chai.request(server)
                    .get(`/api/accounts/${ account1._id }/operations`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(100);
                        expect(moment(res.body[0].date).isSame('2016-12-31')).to.be.equal(true);
                        expect(res.body[0].month).to.be.equal(201612);
                        done();
                    });
            });

            it('should return the list of operations', done => {
                chai.request(server)
                    .get(`/api/accounts/${ account2._id }/operations`)
                    .set('x-access-token', token2)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(100);
                        expect(moment(res.body[0].date).isSame('2016-12-08')).to.be.equal(true);
                        expect(res.body[0].month).to.be.equal(201612);
                        done();
                    });
            });

            it('should not return the list of operations for a private account', done => {
                chai.request(server)
                    .get(`/api/accounts/${ account2._id }/operations`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should not return the list of operations for an unknown account', done => {
                chai.request(server)
                    .get(`/api/accounts/5808e3f676c536002176f467/operations`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should return the list of all operations for a shared account', done => {
                chai.request(server)
                    .get(`/api/accounts/${ account3._id }/operations`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(200);
                        expect(moment(res.body[0].date).isSame('2016-05-10')).to.be.equal(true);
                        expect(res.body[0].month).to.be.equal(201605);
                        done();
                    });
            });
        });
    });

    describe('POST /accounts/:id/operations', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .post(`/api/accounts/${ account1._id }/operations`)
                .send({})
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    done();
                });
        });

        describe('authenticated', () => {
            it('should create a new operation', done => {
                chai.request(server)
                    .post(`/api/accounts/${ account1._id }/operations`)
                    .send({ description: 'A new operation', date: '2016-12-31', amount: 50 })
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(201);
                        expect(res.body).to.be.an('object');
                        expect(moment(res.body.date).isSame('2016-12-31')).to.be.equal(true);
                        expect(res.body.month).to.be.equal(201612);
                        expect(res.body.amount).to.be.equal(50);
                        expect(res.body.description).to.be.equal('A new operation');
                        expect(res.body.creator).to.be.equal(user1._id.toString());
                        expect(res.body.account).to.be.equal(account1._id.toString());

                        chai.request(server)
                            .get(`/api/accounts/${ account1._id }/operations`)
                            .set('x-access-token', token1)
                            .end((err, res) => {
                                expect(res.status).to.be.equal(200);
                                expect(res.body).to.be.an('array');
                                expect(res.body.length).to.be.equal(101);
                                done();
                            });
                    });
            });

            it('should not create a new operation on an unshared account', done => {
                chai.request(server)
                    .post(`/api/accounts/${ account2._id }/operations`)
                    .send({description: 'A new operation', date: '2016-12-31', amount: 50})
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;

                        chai.request(server)
                            .get(`/api/accounts/${ account2._id }/operations`)
                            .set('x-access-token', token2)
                            .end((err, res) => {
                                expect(res.status).to.be.equal(200);
                                expect(res.body).to.be.an('array');
                                expect(res.body.length).to.be.equal(100);
                                done();
                            });
                    });
            });

            it('should not create a new operation with invalid data', done => {
                chai.request(server)
                    .post(`/api/accounts/${ account1._id }/operations`)
                    .send({ description: 'A new operation', date: '2016--31', amount: 'test' })
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(400);
                        expect(res.body).to.be.empty;

                        chai.request(server)
                            .get(`/api/accounts/${ account1._id }/operations`)
                            .set('x-access-token', token1)
                            .end((err, res) => {
                                expect(res.status).to.be.equal(200);
                                expect(res.body).to.be.an('array');
                                expect(res.body.length).to.be.equal(101);
                                done();
                            });
                    });
            });

            it('should create a new operation on a shared account', done => {
                chai.request(server)
                    .post(`/api/accounts/${ account3._id }/operations`)
                    .send({ description: 'A new shared operation', date: '2017-01-20', amount: 789 })
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(201);
                        expect(res.body).to.be.an('object');
                        expect(moment(res.body.date).isSame('2017-01-20')).to.be.equal(true);
                        expect(res.body.month).to.be.equal(201701);
                        expect(res.body.amount).to.be.equal(789);
                        expect(res.body.description).to.be.equal('A new shared operation');
                        expect(res.body.creator).to.be.equal(user1._id.toString());
                        expect(res.body.account).to.be.equal(account3._id.toString());

                        chai.request(server)
                            .get(`/api/accounts/${ account3._id }/operations`)
                            .set('x-access-token', token1)
                            .end((err, res) => {
                                expect(res.status).to.be.equal(200);
                                expect(res.body).to.be.an('array');
                                expect(res.body.length).to.be.equal(201);
                                done();
                            });
                    });
            });
        });
    });

    describe('GET /operations/:id', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .get(`/api/operations/5808e3f676c536002176f467`)
                .send({})
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    expect(res.body).to.be.empty;
                    done();
                });
        });

        describe('authenticated', () => {
            let operation1;
            let operation2;

            before(() => new Operation({
                    description: 'My very own operation',
                    type: 'Type',
                    amount: 53.5,
                    isChecked: true,
                    isReconciled: false,
                    date: new Date('2016-10-01'),
                    creator: user1._id,
                    account: account1._id
                })
                .save()
                .then(operation => operation1 = operation)
            );

            before(() => new Operation({
                    description: 'My shared operation',
                    amount: 140,
                    isChecked: false,
                    date: new Date('2015-12-01'),
                    creator: user2._id,
                    account: account3._id
                })
                    .save()
                    .then(operation => operation2 = operation)
            );

            after(() => operation1.remove());
            after(() => operation2.remove());

            it('should retrieve the operation', done => {
                chai.request(server)
                    .get(`/api/operations/${ operation1._id }`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(moment(res.body.date).isSame('2016-10-01')).to.be.equal(true);
                        expect(res.body.month).to.be.equal(201610);
                        expect(res.body.amount).to.be.equal(53.5);
                        expect(res.body.isChecked).to.be.equal(true);
                        expect(res.body.isReconciled).to.be.equal(false);
                        expect(res.body.description).to.be.equal('My very own operation');
                        expect(res.body.type).to.be.equal('Type');
                        expect(res.body.creator).to.be.equal(user1._id.toString());
                        expect(res.body.account).to.be.equal(account1._id.toString());

                        done();
                    });
            });

            it('should not find an invalid operation', done => {
                chai.request(server)
                    .get(`/api/operations/5808e3f676c536002176f467`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;

                        done();
                    });
            });

            it('should retrieve the operation of a shared account for its creator', done => {
                chai.request(server)
                    .get(`/api/operations/${ operation2._id }`)
                    .set('x-access-token', token2)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(moment(res.body.date).isSame('2015-12-01')).to.be.equal(true);
                        expect(res.body.month).to.be.equal(201512);
                        expect(res.body.amount).to.be.equal(140);
                        expect(res.body.isChecked).to.be.equal(false);
                        expect(res.body.isReconciled).to.be.undefined;
                        expect(res.body.description).to.be.equal('My shared operation');
                        expect(res.body.type).to.be.undefined;
                        expect(res.body.creator).to.be.equal(user2._id.toString());
                        expect(res.body.account).to.be.equal(account3._id.toString());

                        done();
                    });
            });

            it('should retrieve the operation of a shared account for a user with access', done => {
                chai.request(server)
                    .get(`/api/operations/${ operation2._id }`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(moment(res.body.date).isSame('2015-12-01')).to.be.equal(true);
                        expect(res.body.month).to.be.equal(201512);
                        expect(res.body.amount).to.be.equal(140);
                        expect(res.body.isChecked).to.be.equal(false);
                        expect(res.body.isReconciled).to.be.undefined;
                        expect(res.body.description).to.be.equal('My shared operation');
                        expect(res.body.type).to.be.undefined;
                        expect(res.body.creator).to.be.equal(user2._id.toString());
                        expect(res.body.account).to.be.equal(account3._id.toString());

                        done();
                    });
            });

            it('should not retrieve the operation of a shared account for a user with no access', done => {
                chai.request(server)
                    .get(`/api/operations/${ operation2._id }`)
                    .set('x-access-token', token3)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;

                        done();
                    });
            });
        });
    });

    describe('PUT /operations/:id', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .put(`/api/operations/5808e3f676c536002176f467`)
                .send({})
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    expect(res.body).to.be.empty;
                    done();
                });
        });

        describe('authenticated', () => {
            let operation1;
            let operation2;

            before(() => new Operation({
                    description: 'My very own operation',
                    type: 'Type',
                    amount: 53.5,
                    isChecked: true,
                    isReconciled: false,
                    date: new Date('2016-10-01'),
                    creator: user1._id,
                    account: account1._id
                })
                    .save()
                    .then(operation => operation1 = operation)
            );

            before(() => new Operation({
                    description: 'My shared operation',
                    amount: 140,
                    isChecked: false,
                    date: new Date('2015-12-01'),
                    creator: user2._id,
                    account: account3._id
                })
                    .save()
                    .then(operation => operation2 = operation)
            );

            after(() => operation1.remove());
            after(() => operation2.remove());

            it('should update the operation', done => {
                chai.request(server)
                    .put(`/api/operations/${ operation1._id }`)
                    .set('x-access-token', token1)
                    .send({
                        date: '2016-05-14',
                        amount: 84
                    })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(moment(res.body.date).isSame('2016-05-14')).to.be.equal(true);
                        expect(res.body.month).to.be.equal(201605);
                        expect(res.body.amount).to.be.equal(84);
                        expect(res.body.isChecked).to.be.equal(true);
                        expect(res.body.isReconciled).to.be.equal(false);
                        expect(res.body.description).to.be.equal('My very own operation');
                        expect(res.body.type).to.be.equal('Type');
                        expect(res.body.creator).to.be.equal(user1._id.toString());
                        expect(res.body.account).to.be.equal(account1._id.toString());

                        Operation
                            .findById(operation1._id)
                            .exec()
                            .then(operation => {
                                expect(moment(operation.date).isSame('2016-05-14')).to.be.equal(true);
                                expect(operation.month).to.be.equal(201605);
                                expect(operation.amount).to.be.equal(84);
                                expect(operation.isChecked).to.be.equal(true);
                                expect(operation.isReconciled).to.be.equal(false);
                                expect(operation.description).to.be.equal('My very own operation');
                                expect(operation.type).to.be.equal('Type');
                                expect(operation.creator.toString()).to.be.equal(user1._id.toString());
                                expect(operation.account.toString()).to.be.equal(account1._id.toString());

                                done();
                            }).fail(err => console.log(err));
                    });
            });

            it('should update the operation, but not the creator nor the account', done => {
                chai.request(server)
                    .put(`/api/operations/${ operation1._id }`)
                    .set('x-access-token', token1)
                    .send({
                        date: '2015-01-01',
                        amount: 0.5,
                        creator: user3._id,
                        account: account3._id
                    })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(moment(res.body.date).isSame('2015-01-01')).to.be.equal(true);
                        expect(res.body.month).to.be.equal(201501);
                        expect(res.body.amount).to.be.equal(0.5);
                        expect(res.body.isChecked).to.be.equal(true);
                        expect(res.body.isReconciled).to.be.equal(false);
                        expect(res.body.description).to.be.equal('My very own operation');
                        expect(res.body.type).to.be.equal('Type');
                        expect(res.body.creator).to.be.equal(user1._id.toString());
                        expect(res.body.account).to.be.equal(account1._id.toString());

                        Operation
                            .findById(operation1._id)
                            .exec()
                            .then(operation => {
                                expect(moment(operation.date).isSame('2015-01-01')).to.be.equal(true);
                                expect(operation.month).to.be.equal(201501);
                                expect(operation.amount).to.be.equal(0.5);
                                expect(operation.isChecked).to.be.equal(true);
                                expect(operation.isReconciled).to.be.equal(false);
                                expect(operation.description).to.be.equal('My very own operation');
                                expect(operation.type).to.be.equal('Type');
                                expect(operation.creator.toString()).to.be.equal(user1._id.toString());
                                expect(operation.account.toString()).to.be.equal(account1._id.toString());

                                done();
                            }).fail(err => console.log(err));
                    });
            });

            it('should not find an invalid operation', done => {
                chai.request(server)
                    .put(`/api/operations/5808e3f676c536002176f467`)
                    .set('x-access-token', token1)
                    .send({
                        date: '2016-05-14',
                        amount: 8000
                    })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;

                        done();
                    });
            });

            it('should not update an unshared operation for another user', done => {
                chai.request(server)
                    .put(`/api/operations/${ operation1._id }`)
                    .set('x-access-token', token2)
                    .send({
                        date: '2010-12-31',
                        amount: 10000
                    })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;
                        
                        Operation
                            .findById(operation1._id)
                            .exec()
                            .then(operation => {
                                expect(moment(operation.date).isSame('2015-01-01')).to.be.equal(true);
                                expect(operation.month).to.be.equal(201501);
                                expect(operation.amount).to.be.equal(0.5);
                                expect(operation.isChecked).to.be.equal(true);
                                expect(operation.isReconciled).to.be.equal(false);
                                expect(operation.description).to.be.equal('My very own operation');
                                expect(operation.type).to.be.equal('Type');
                                expect(operation.creator.toString()).to.be.equal(user1._id.toString());
                                expect(operation.account.toString()).to.be.equal(account1._id.toString());
                                
                                done();
                            }).fail(err => console.log(err));
                    });
            });

            it('should update a shared operation for a user with access', done => {
                chai.request(server)
                    .put(`/api/operations/${ operation2._id }`)
                    .set('x-access-token', token1)
                    .send({
                        date: '2010-12-31',
                        amount: 10000,
                        description: 'Update of the shared operation'
                    })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(moment(res.body.date).isSame('2010-12-31')).to.be.equal(true);
                        expect(res.body.month).to.be.equal(201012);
                        expect(res.body.amount).to.be.equal(10000);
                        expect(res.body.description).to.be.equal('Update of the shared operation');
                        expect(res.body.creator).to.be.equal(user2._id.toString());
                        expect(res.body.account).to.be.equal(account3._id.toString());

                        Operation
                            .findById(operation2._id)
                            .exec()
                            .then(operation => {
                                expect(moment(operation.date).isSame('2010-12-31')).to.be.equal(true);
                                expect(operation.month).to.be.equal(201012);
                                expect(operation.amount).to.be.equal(10000);
                                expect(operation.description).to.be.equal('Update of the shared operation');
                                expect(operation.creator.toString()).to.be.equal(user2._id.toString());
                                expect(operation.account.toString()).to.be.equal(account3._id.toString());
                                
                                done();
                            }).fail(err => console.log(err));
                    });
            });
        });
    });

    describe('DELETE /operations/:id', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .delete(`/api/operations/5808e3f676c536002176f467`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    expect(res.body).to.be.empty;
                    done();
                });
        });

        describe('authenticated', () => {
            let operation1;
            let operation2;

            beforeEach(() => new Operation({
                    description: 'My very own operation',
                    type: 'Type',
                    amount: 53.5,
                    isChecked: true,
                    isReconciled: false,
                    date: new Date('2016-10-01'),
                    creator: user1._id,
                    account: account1._id
                })
                    .save()
                    .then(operation => operation1 = operation)
            );

            beforeEach(() => new Operation({
                    description: 'My shared operation',
                    amount: 140,
                    isChecked: false,
                    date: new Date('2015-12-01'),
                    creator: user2._id,
                    account: account3._id
                })
                    .save()
                    .then(operation => operation2 = operation)
            );

            afterEach(() => operation1.remove());
            afterEach(() => operation2.remove());

            it('should delete the operation', done => {
                chai.request(server)
                    .delete(`/api/operations/${ operation1._id }`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(204);
                        expect(res.body).to.be.empty;

                        Operation
                            .findById(operation1._id)
                            .exec()
                            .then(operation => {
                                expect(operation).to.be.a('null');

                                done();
                            }).fail(err => console.log(err));
                    });
            });

            it('should not delete an invalid operation', done => {
                chai.request(server)
                    .delete(`/api/operations/5808e3f676c536002176f467`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;

                        Operation
                            .findById(operation1._id)
                            .exec()
                            .then(operation => {
                                expect(operation).to.be.an('object');

                                done();
                            }).fail(err => console.log(err));
                    });
            });

            it('should not delete an operation for an invalid user', done => {
                chai.request(server)
                    .delete(`/api/operations/${ operation1._id }`)
                    .set('x-access-token', token2)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;

                        Operation
                            .findById(operation1._id)
                            .exec()
                            .then(operation => {
                                expect(operation).to.be.an('object');

                                done();
                            }).fail(err => console.log(err));
                    });
            });

            it('should delete a shared operation for its creator', done => {
                chai.request(server)
                    .delete(`/api/operations/${ operation2._id }`)
                    .set('x-access-token', token2)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(204);
                        expect(res.body).to.be.empty;

                        Operation
                            .findById(operation2._id)
                            .exec()
                            .then(operation => {
                                expect(operation).to.be.a('null');

                                done();
                            }).fail(err => console.log(err));
                    });
            });

            it('should delete a shared operation for a shared user', done => {
                chai.request(server)
                    .delete(`/api/operations/${ operation2._id }`)
                    .set('x-access-token', token1)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(204);
                        expect(res.body).to.be.empty;

                        Operation
                            .findById(operation2._id)
                            .exec()
                            .then(operation => {
                                expect(operation).to.be.a('null');

                                done();
                            }).fail(err => console.log(err));
                    });
            });

            it('should not delete a shared operation for anyone else', done => {
                chai.request(server)
                    .delete(`/api/operations/${ operation2._id }`)
                    .set('x-access-token', token3)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;

                        Operation
                            .findById(operation2._id)
                            .exec()
                            .then(operation => {
                                expect(operation).to.be.an('object');

                                done();
                            }).fail(err => console.log(err));
                    });
            });
        });
    });
});
