'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    isAdmin: Boolean,
    accounts: [{
        owner: Boolean,
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        }
    }]
}));