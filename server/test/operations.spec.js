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
    let token;
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
            .then(user => user2 = user)
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
                token = res.body.token;
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
                    date: moment("2016-12-31").subtract(i, 'day'),
                    creator: user1._id,
                    account: account1._id
                }).save()
            );

            promises.push(
                new Operation({
                    description: `My second operation ${ i }`,
                    amount: Math.floor(Math.random() * 100),
                    date: moment("2016-08-31").add(i, 'day'),
                    creator: user2._id,
                    account: account2._id
                }).save()
            );

            promises.push(
                new Operation({
                    description: `My third operation ${ i }`,
                    amount: Math.floor(Math.random() * 100),
                    date: moment("2016-01-01").add(i, 'day'),
                    creator: user1._id,
                    account: account3._id
                }).save()
            );
            promises.push(
                new Operation({
                    description: `My third operation ${ i }`,
                    amount: Math.floor(Math.random() * 100),
                    date: moment("2016-02-01").add(i, 'day'),
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
                    .set('x-access-token', token)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(100);
                        expect(moment(res.body[0].date).isSame("2016-12-31")).to.be.equal(true);
                        expect(res.body[0].month).to.be.equal(201612);
                        done();
                    });
            });

            it('should not return the list of operations for a private account', done => {
                chai.request(server)
                    .get(`/api/accounts/${ account2._id }/operations`)
                    .set('x-access-token', token)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should not return the list of operations for an unknown account', done => {
                chai.request(server)
                    .get(`/api/accounts/5808e3f676c536002176f467/operations`)
                    .set('x-access-token', token)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(404);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            it('should return the list of all operations for a shared account', done => {
                chai.request(server)
                    .get(`/api/accounts/${ account3._id }/operations`)
                    .set('x-access-token', token)
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(200);
                        expect(moment(res.body[0].date).isSame("2016-05-10")).to.be.equal(true);
                        expect(res.body[0].month).to.be.equal(201605);
                        done();
                    });
            });
        });
    });
});
