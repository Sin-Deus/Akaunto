const Errors = require('../utils/errors');
const config = require('config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate(email, password) {
        return User
            .findOne({ email })
            .exec()
            .then(user => {
                if (!user) {
                    throw new Errors.NotFoundError();
                }
                return user;
            })
            .then(user => user.comparePassword(password))
            .then(result => {
                if (!result.isMatch) {
                    throw new Error();
                }
                return jwt.sign(result.user, config.secret, {
                    expiresIn: 3600 // expires in 1 hour
                });
            });
    }
};
