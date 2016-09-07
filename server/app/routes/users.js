'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.route('/').get((req, res) => {
    User.find({}, (err, users) =>
        res.json(users)
    );
});

router.route('/setup').get((req, res) => {
    let user = new User({
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'McTest',
        password: 'password',
        isAdmin: false
    });

    user.save(err => {
        if (err) { throw err; }

        console.log(`User ${user.firstName} saved successfully`);
        res.json(user);
    });
});

module.exports = router;
