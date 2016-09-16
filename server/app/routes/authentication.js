const HttpStatus = require('http-status-codes');
const config = require('../../config');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.route('/').post((req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            throw err;
        }

        if (!user) {
            res.sendStatus(HttpStatus.FORBIDDEN);
        } else {
            user.comparePassword(req.body.password, (compareErr, isMatch) => {
                if (compareErr) {
                    res.status(HttpStatus.BAD_REQUEST).send(compareErr);
                } else if (!isMatch) {
                    res.sendStatus(HttpStatus.BAD_REQUEST);
                } else {
                    const token = jwt.sign(user, config.secret, {
                        expiresIn: 3600 // expires in 1 hour
                    });

                    res.json({ token });
                }
            });
        }
    });
});

module.exports = router;
