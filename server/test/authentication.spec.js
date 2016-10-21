process.env.NODE_ENV = 'test';

let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../app/models/User');
let should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
    before(() => {
        let user = new User({
            email: 'test@test.com',
            password: 'p@ssw0rd'
        });
        return user.save();
    });

    after(() => User.remove({}).exec());

    describe('POST /authenticate', () => {
        it('should respond to the request', done => {
            chai.request(server)
                .post('/authenticate')
                .end((err, res) => {
                    expect(res.status).to.be.equal(404);
                    expect(res.body).to.be.empty;
                    done();
                });
        });

        it('should not find any user with a wrong e-mail', done => {
            chai.request(server)
                .post('/authenticate')
                .send({ email: 'unusedemail@gmail.com', password: 'password' })
                .end((err, res) => {
                    expect(res.status).to.be.equal(404);
                    expect(res.body).to.be.empty;
                    done();
                });
        });

        it('should find a user, but fail to authenticate with a wrong password', done => {
            chai.request(server)
                .post('/authenticate')
                .send({ email: 'test@test.com', password: 'password' })
                .end((err, res) => {
                    expect(res.status).to.be.equal(400);
                    expect(res.body).to.be.empty;
                    done();
                });
        });

        it('should find a user, and return a valid token with the correct password', done => {
            chai.request(server)
                .post('/authenticate')
                .send({ email: 'test@test.com', password: 'p@ssw0rd' })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('token');
                    done();
                });
        });
    })
});
