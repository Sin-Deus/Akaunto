'use strict';

const config = require('../../config');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.route('/').post((req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) { throw err; }

        if (!user) {
            res.sendStatus(401);
        } else {
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) {
                    res.status(400).send(err);
                } else if (!isMatch) {
                    res.sendStatus(400);
                } else {
                    let token = jwt.sign(user, config.secret, {
                        expiresIn: 3600 // expires in 1 hour
                    });

                    res.json({token: token});
                }
            });
        }
    });
});

module.exports = router;
