process.env.NODE_ENV = 'test';

let chai = require('chai');
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

    describe('/POST authenticate', () => {
        it('should respond to the request', done => {
            chai.request(server)
                .post('/authenticate')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('should not find any user with a wrong e-mail', done => {
            chai.request(server)
                .post('/authenticate')
                .send({ email: 'unusedemail@gmail.com', password: 'password' })
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('should find a user, but fail to authenticate with a wrong password', done => {
            chai.request(server)
                .post('/authenticate')
                .send({ email: 'test@test.com', password: 'password' })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('should find a user, and return a valid token with the correct password', done => {
            chai.request(server)
                .post('/authenticate')
                .send({ email: 'test@test.com', password: 'p@ssw0rd' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
    })
});
