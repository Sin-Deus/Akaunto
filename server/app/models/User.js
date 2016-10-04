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
    locale: String,
    update: Date,
    accounts: [{
        owner: Boolean,
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        }
    }]
});

/**
 * Encrypts the password of the given user.
 * @param {object} user
 * @param {string} user.password
 * @param {function} [cb] An optional callback.
 * @private
 */
function _encryptPassword(user, cb) {
    bcrypt.genSalt(SALT_WORK_FACTOR, (saltErr, salt) => {
        if (saltErr) {
            return cb && cb(saltErr);
        }

        bcrypt.hash(user.password, salt, (hashErr, hash) => {
            if (hashErr) {
                return cb && cb(hashErr);
            }

            user.password = hash;
            return cb && cb();
        });
    });
}

UserSchema.pre('save', function (next) {
    this.update = new Date();

    if (!this.isModified('password')) {
        return next();
    }

    _encryptPassword(this, next);
});

UserSchema.pre('update', function () {
    this.update({}, { $set: { update: new Date() } });
});

UserSchema.pre('findOneAndUpdate', function () {
    this.update({}, { $set: { update: new Date() } });
});

UserSchema.statics.encryptPassword = function (user, cb) {
    _encryptPassword(user, cb);
};

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
