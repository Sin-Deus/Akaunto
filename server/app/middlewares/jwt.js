'use strict';

const config = require('../../config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            } else {
                req.user = _.omit(decoded._doc, 'password', 'accounts');
                next();
            }
        });
    } else {
        return res.sendStatus(403);
    }
};