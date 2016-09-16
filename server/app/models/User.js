const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
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
    /* eslint-disable consistent-this */
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, (saltErr, salt) => {
        if (saltErr) {
            return next(saltErr);
        }

        bcrypt.hash(user.password, salt, (hashErr, hash) => {
            if (hashErr) {
                return next(hashErr);
            }

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.set('toJSON', {
    transform: (doc, ret) => _.omit(ret, 'password')
});

module.exports = mongoose.model('User', UserSchema);
