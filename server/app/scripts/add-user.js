'use strict';

const config = require('../../config');
const mongoose = require('mongoose');
const prompt = require('prompt');
const User = require('../models/User');

mongoose.connect(config.database);

const schema = {
    properties: {
        email: {
            required: true
        },
        firstName: {
            default: 'Admin'
        },
        lastName: {
            default: 'Admin'
        },
        password: {
            hidden: true,
            required: true
        },
        isAdmin: {
            required: false,
            default: false
        }
    }
};

prompt.start();

prompt.get(schema, (err, result) => {
    if (err) { throw err; }

    let user = new User({
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        password: result.password,
        isAdmin: result.isAdmin
    });

    user.save(err => {
        if (err) { throw err; }

        console.log(`User ${user.firstName} saved successfully`);
    });
});

