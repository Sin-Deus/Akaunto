const HttpStatus = require('http-status-codes');
const config = require('../../config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.sendStatus(HttpStatus.FORBIDDEN);
            }

            req.user = _.omit(decoded._doc, 'password', 'accounts');
            next();
        });
    } else {
        return res.sendStatus(HttpStatus.FORBIDDEN);
    }
};
