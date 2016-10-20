const HttpStatus = require('http-status-codes');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const _ = require('lodash');

module.exports = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.sendStatus(HttpStatus.UNAUTHORIZED);
            }

            User.findById(decoded._doc._id, (userErr, user) => {
                if (userErr || !user) {
                    res.sendStatus(HttpStatus.NOT_FOUND);
                } else {
                    req.user = _.omit(user, 'password', 'accounts');
                    return next();
                }
            });
        });
    } else {
        return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
};
