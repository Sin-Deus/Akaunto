process.env.NODE_ENV = 'test';

let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../app/models/User');
let should = chai.should();

chai.use(chaiHttp);

describe('User', () => {
    let adminToken;
    let plainToken;
    let adminUser;
    let plainUser;

    before(() => {
        return new User({
            email: 'admin@test.com',
            password: 'p@ssw0rd',
            isAdmin: true
        })
            .save()
            .then(user => {
                adminUser = user;
            });
    });

    before(() => {
        return new User({
            email: 'plain@test.com',
            password: 'p@ssword',
            isAdmin: false
        })
            .save()
            .then(user => {
                plainUser = user;
            });
    });

    before(done => {
        chai.request(server)
            .post('/authenticate')
            .send({ email: 'admin@test.com', password: 'p@ssw0rd' })
            .end((err, res) => {
                adminToken = res.body.token;
                done();
            });
    });

    before(done => {
        chai.request(server)
            .post('/authenticate')
            .send({ email: 'plain@test.com', password: 'p@ssword' })
            .end((err, res) => {
                plainToken = res.body.token;
                done();
            });
    });

    after(() => User.remove({}).exec());

    describe('GET /users', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    done();
                });
        });

        describe('authenticated', () => {
            it('should return the list of users', done => {
                chai.request(server)
                    .get('/api/users')
                    .set('x-access-token', adminToken)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(2);
                        expect(res.body[0].email).to.be.equal('admin@test.com');
                        expect(res.body[0].password).to.be.an('undefined');
                        expect(res.body[1].email).to.be.equal('plain@test.com');
                        done();
                    });
            });
        });
    });

    describe('GET /me', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .get('/api/users/me')
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    expect(res.body).to.be.empty;
                    done();
                });
        });

        describe('authenticated', () => {
            it('should return the current admin user', done => {
                chai.request(server)
                    .get('/api/users/me')
                    .set('x-access-token', adminToken)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.email).to.be.equal('admin@test.com');
                        expect(res.body.showOwnAccounts).to.be.equal(true);
                        expect(res.body.showOtherAccounts).to.be.equal(true);
                        expect(res.body.isAdmin).to.be.equal(true);
                        expect(res.body.password).to.be.an('undefined');
                        expect(res.body.firstName).to.be.an('undefined');
                        expect(res.body.lastName).to.be.an('undefined');
                        done();
                    });
            });

            it('should return the current plain user', done => {
                chai.request(server)
                    .get('/api/users/me')
                    .set('x-access-token', plainToken)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.email).to.be.equal('plain@test.com');
                        expect(res.body.showOwnAccounts).to.be.equal(true);
                        expect(res.body.showOtherAccounts).to.be.equal(true);
                        expect(res.body.isAdmin).to.be.equal(false);
                        expect(res.body.password).to.be.an('undefined');
                        expect(res.body.firstName).to.be.an('undefined');
                        expect(res.body.lastName).to.be.an('undefined');
                        done();
                    });
            });
        });
    });

    describe('GET /users/:id', () => {
        let user = new User({
            firstName: 'Test',
            lastName: 'McTest',
            password: 'password',
            email: 'mc@test.com',
            isAdmin: false
        });

        before(done => {
            user.save()
                .then(newUser => {
                    user = newUser;
                    done();
                });
        });

        after(() => user.remove());

        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .get('/api/users/1234')
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    expect(res.body).to.be.empty;
                    done();
                });
        });

        describe('authenticated', () => {
            it('should not found a user with an invalid id', done => {
                chai.request(server)
                    .get(`/api/users/1234`)
                    .set('x-access-token', adminToken)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should not found the requested user', done => {
                chai.request(server)
                    .get(`/api/users/5808e3f676c536002176f467`)
                    .set('x-access-token', adminToken)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should return the requested user, as an admin user', done => {
                chai.request(server)
                    .get(`/api/users/${ user._id }`)
                    .set('x-access-token', adminToken)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.email).to.be.equal('mc@test.com');
                        expect(res.body.firstName).to.be.equal('Test');
                        expect(res.body.lastName).to.be.equal('McTest');
                        expect(res.body.isAdmin).to.be.equal(false);
                        expect(res.body.password).to.be.an('undefined');
                        done();
                    });
            });

            it('should return the requested user, as a plain user', done => {
                chai.request(server)
                    .get(`/api/users/${ user._id }`)
                    .set('x-access-token', plainToken)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.email).to.be.equal('mc@test.com');
                        expect(res.body.firstName).to.be.equal('Test');
                        expect(res.body.lastName).to.be.equal('McTest');
                        expect(res.body.isAdmin).to.be.equal(false);
                        expect(res.body.password).to.be.an('undefined');
                        done();
                    });
            });
        });
    });

    describe('PUT /me', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .put('/api/users/me')
                .send({ firstName: 'Admin' })
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    expect(res.body).to.be.empty;
                    done();
                });
        });

        describe('authenticated', () => {
            it('should update the current user', done => {
                chai.request(server)
                    .put('/api/users/me')
                    .set('x-access-token', adminToken)
                    .send({ firstName: 'Admin', lastName: 'McAdmin', locale: 'fr', showOtherAccounts: false })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body._id).to.be.equal(adminUser._id.toString());
                        expect(res.body.email).to.be.equal('admin@test.com');
                        expect(res.body.showOwnAccounts).to.be.equal(true);
                        expect(res.body.showOtherAccounts).to.be.equal(false);
                        expect(res.body.isAdmin).to.be.equal(true);
                        expect(res.body.firstName).to.be.equal('Admin');
                        expect(res.body.lastName).to.be.equal('McAdmin');
                        expect(res.body.locale).to.be.equal('fr');
                        expect(res.body.password).to.be.an('undefined');
                        done();
                    });
            });

            it('should not update the isAdmin property for an admin user', done => {
                chai.request(server)
                    .put('/api/users/me')
                    .set('x-access-token', adminToken)
                    .send({ firstName: 'Admin2', locale: 'en', isAdmin: false })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body._id).to.be.equal(adminUser._id.toString());
                        expect(res.body.email).to.be.equal('admin@test.com');
                        expect(res.body.isAdmin).to.be.equal(true);
                        expect(res.body.firstName).to.be.equal('Admin2');
                        expect(res.body.lastName).to.be.equal('McAdmin');
                        expect(res.body.locale).to.be.equal('en');
                        expect(res.body.password).to.be.an('undefined');
                        done();
                    });
            });

            it('should not update the isAdmin property for a plain user', done => {
                chai.request(server)
                    .put('/api/users/me')
                    .set('x-access-token', plainToken)
                    .send({ firstName: 'Plain', locale: 'en', isAdmin: true })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body._id).to.be.equal(plainUser._id.toString());
                        expect(res.body.email).to.be.equal('plain@test.com');
                        expect(res.body.isAdmin).to.be.equal(false);
                        expect(res.body.firstName).to.be.equal('Plain');
                        expect(res.body.password).to.be.an('undefined');
                        done();
                    });
            });

            it('should not update their id', done => {
                chai.request(server)
                    .put('/api/users/me')
                    .set('x-access-token', adminToken)
                    .send({ _id: '5808e3f676c536002176f467' })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(400);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            describe('update password', () => {
                it('should update the password, and invalidate the token', done => {
                    done();
                });
            });
        });
    });

    describe('DELETE /users/:id', () => {
        it('should not respond to unauthenticated requests', done => {
            chai.request(server)
                .delete('/api/users/1234')
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    done();
                });
        });

        describe('authenticated', () => {
            describe('invalid id', () => {
                let user = new User({
                    firstName: 'Test',
                    lastName: 'McTest',
                    password: 'password',
                    email: 'todelete@test.com',
                    isAdmin: false
                });

                before(done => {
                    user.save()
                        .then(newUser => {
                            user = newUser;
                            done();
                        });
                });

                after(() => user.remove());

                it('should not delete a user with an invalid id', done => {
                    chai.request(server)
                        .delete('/api/users/1234')
                        .set('x-access-token', adminToken)
                        .end((err, res) => {
                            expect(res.status).to.be.equal(400);
                            expect(res.body).to.be.empty;
                            done();
                        });
                });

                it('should still exist', done => {
                    chai.request(server)
                        .get(`/api/users/${ user._id }`)
                        .set('x-access-token', adminToken)
                        .end((err, res) => {
                            expect(res.status).to.be.equal(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.email).to.be.equal('todelete@test.com');
                            done();
                        });
                });
            });

            describe('unknown id', () => {
                let user = new User({
                    firstName: 'Test',
                    lastName: 'McTest',
                    password: 'password',
                    email: 'todelete@test.com',
                    isAdmin: false
                });

                before(done => {
                    user.save()
                        .then(newUser => {
                            user = newUser;
                            done();
                        });
                });

                after(() => user.remove());

                it('should not delete a user with an unknown id', done => {
                    chai.request(server)
                        .delete('/api/users/5808e3f676c536002176f467')
                        .set('x-access-token', adminToken)
                        .end((err, res) => {
                            expect(res.status).to.be.equal(404);
                            expect(res.body).to.be.empty;
                            done();
                        });
                });

                it('should still exist', done => {
                    chai.request(server)
                        .get(`/api/users/${ user._id }`)
                        .set('x-access-token', adminToken)
                        .end((err, res) => {
                            expect(res.status).to.be.equal(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.email).to.be.equal('todelete@test.com');
                            done();
                        });
                });
            });

            describe('correct id, as an admin user', () => {
                let user = new User({
                    firstName: 'Test',
                    lastName: 'McTest',
                    password: 'password',
                    email: 'todelete@test.com',
                    isAdmin: false
                });

                before(done => {
                    user.save()
                        .then(newUser => {
                            user = newUser;
                            done();
                        });
                });

                after(() => user.remove());

                it('should delete the requested user, as an admin user', done => {
                    chai.request(server)
                        .delete(`/api/users/${ user._id }`)
                        .set('x-access-token', adminToken)
                        .end((err, res) => {
                            expect(res.status).to.be.equal(204);
                            expect(res.body).to.be.empty;
                            done();
                        });
                });

                it('should not exist anymore', done => {
                    chai.request(server)
                        .get(`/api/users/${ user._id }`)
                        .set('x-access-token', adminToken)
                        .end((err, res) => {
                            expect(res.status).to.be.equal(404);
                            expect(res.body).to.be.empty;
                            done();
                        });
                });
            });

            describe('correct id, as a plain user', () => {
                let user = new User({
                    firstName: 'Test',
                    lastName: 'McTest',
                    password: 'password',
                    email: 'todelete@test.com',
                    isAdmin: false
                });

                before(done => {
                    user.save()
                        .then(newUser => {
                            user = newUser;
                            done();
                        });
                });

                after(() => user.remove());

                it('should not delete the requested user, as a plain user', done => {
                    chai.request(server)
                        .delete(`/api/users/${ user._id }`)
                        .set('x-access-token', plainToken)
                        .end((err, res) => {
                            expect(res.status).to.be.equal(403);
                            expect(res.body).to.be.empty;
                            done();
                        });
                });

                it('should still exist', done => {
                    chai.request(server)
                        .get(`/api/users/${ user._id }`)
                        .set('x-access-token', adminToken)
                        .end((err, res) => {
                            expect(res.status).to.be.equal(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.email).to.be.equal('todelete@test.com');
                            done();
                        });
                });
            });
        });
    });
});
