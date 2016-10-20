const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Q = require('q');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    firstName: String,
    lastName: String,
    password: { type: String, required: true },
    isAdmin: Boolean,
    locale: String,
    showOwnAccounts: {
        type: Boolean,
        default: true
    },
    showOtherAccounts: {
        type: Boolean,
        default: true
    },
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
 * @return {Promise<User>}
 * @private
 */
function _encryptPassword(user) {
    const deferred = Q.defer();

    bcrypt.genSalt(SALT_WORK_FACTOR, (saltErr, salt) => {
        if (saltErr) {
            deferred.reject(saltErr);
        } else {
            bcrypt.hash(user.password, salt, (hashErr, hash) => {
                if (hashErr) {
                    deferred.reject(hashErr);
                } else {
                    user.password = hash;
                    deferred.resolve(user);
                }
            });
        }
    });

    return deferred.promise;
}

UserSchema.pre('save', function (next) {
    this.update = new Date();

    if (!this.isModified('password')) {
        return next();
    }

    _encryptPassword(this).then(next);
});

UserSchema.pre('update', function () {
    this.update({}, { $set: { update: new Date() } });
});

UserSchema.pre('findOneAndUpdate', function () {
    this.update({}, { $set: { update: new Date() } });
});

UserSchema.statics.encryptPassword = function (user) {
    return _encryptPassword(user);
};

UserSchema.methods.comparePassword = function (candidatePassword) {
    const deferred = Q.defer();

    /* eslint-disable consistent-this */
    const user = this;

    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve({ user, isMatch });
        }
    });

    return deferred.promise;
};

UserSchema.set('toJSON', {
    transform: (doc, ret) => _.omit(ret, 'password')
});

module.exports = mongoose.model('User', UserSchema);
