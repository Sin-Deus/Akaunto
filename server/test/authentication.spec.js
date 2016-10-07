const request = require('supertest');
const Mongoose = require('mongoose').Mongoose;
const mongoose = new Mongoose();
const mockgoose = require('mockgoose');

describe('Loading express', function () {
    var server;
    
    before(function(done) {
        mockgoose(mongoose).then(function() {
            mongoose.connect('mongodb:27017/akaunto_test', function (err) {
                done(err);
            });
        });
    });

    beforeEach(() => {
        server = require('../server');
    });

    afterEach(() => {
        server.close();
    });

    it('should respond to /authenticate', function (done) {
        console.log('start');
        request(server)
            .post('/authenticate', {})
            .expect(403, done);
    });
});
