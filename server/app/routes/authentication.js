const HttpStatus = require('http-status-codes');
const config = require('config');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.route('/').post((req, res) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                throw new Error();
            }
            return user;
        })
        .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
        .then(user => user.comparePassword(req.body.password))
        .fail(err => res.status(HttpStatus.BAD_REQUEST).send(err))
        .then(result => {
            if (!result.isMatch) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
            } else {
                const token = jwt.sign(result.user, config.secret, {
                    expiresIn: 3600 // expires in 1 hour
                });

                res.json({ token });
            }
        });
});

module.exports = router;
