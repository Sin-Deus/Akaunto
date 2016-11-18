const User = require('../models/User');
const Errors = require('../utils/errors');
const _ = require('lodash');
const Q = require('q');

/**
 * Updates the given user with the request body, optionally encrypting the password if it's present.
 * @param {string} userId
 * @param {object} data
 * @return {Promise<User>}
 * @private
 */
function _updateUser(userId, data) {
    return Q.fcall(() => {
        Reflect.deleteProperty(data, 'update');
        Reflect.deleteProperty(data, 'isAdmin');
        if (data.password) {
            return User.encryptPassword(data);
        }
        return data;
    })
        .then(user => User.findByIdAndUpdate(userId, user, { new: true }).exec());
}

module.exports = {
    getUsers(filter) {
        const $filter = {};

        if (filter) {
            $filter.$or = [];
            _.each(['firstName', 'lastName'], attr => $filter.$or.push({ [attr]: new RegExp(filter, 'i') }));
        }

        return User
            .find($filter)
            .exec();
    },

    createUser(data) {
        return new User(data).save();
    },

    updateUser(userId, data) {
        return Q.fcall(() => {
            Reflect.deleteProperty(data, 'update');
            Reflect.deleteProperty(data, 'isAdmin');
            if (data.password) {
                return User.encryptPassword(data);
            }
            return data;
        })
            .then(user =>
                User
                    .findByIdAndUpdate(userId, user, { new: true })
                    .exec()
            );
    },

    getUser(userId) {
        return User
            .findOne({ _id: userId })
            .exec()
            .then(user => {
                if (!user) {
                    throw new Errors.NotFoundError();
                }
                return user;
            });
    },

    deleteUser(userId) {
        return User
            .findByIdAndRemove(userId)
            .exec()
            .then(user => {
                if (!user) {
                    throw new Errors.NotFoundError();
                }
                return user;
            });
    }
};
