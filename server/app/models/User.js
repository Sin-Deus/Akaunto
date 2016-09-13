'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    firstName: String,
    lastName: String,
    password: { type: String, required: true },
    isAdmin: Boolean,
    accounts: [{
        owner: Boolean,
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        }
    }]
});

UserSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) { return next(); }

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) { return next(err); }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { return next(err); }

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) { return cb(err); }
        cb(null, isMatch);
    });
};

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        return _.omit(ret, 'password');
    }
});

module.exports = mongoose.model('User', UserSchema);