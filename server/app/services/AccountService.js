const Errors = require('../utils/errors');
const Account = require('../models/Account');
const _ = require('lodash');

module.exports = {
    getAccounts(userId) {
        return Account.find({ $or: [
            { creator: userId },
            { users: { $in: [userId] }
            }] })
            .sort('name')
            .exec();
    },

    createAccount(data, creatorId) {
        const account = new Account(data);
        account.creator = creatorId;

        return account.save();
    },

    getAccount(accountId, userId) {
        return Account.findOne({ _id: accountId })
            .populate('users')
            .exec()
            .then(account => {
                if (!account) {
                    throw new Errors.NotFoundError();
                }
                return account;
            })
            .then(account => {
                if (!account.isAllowedUser(userId)) {
                    throw new Errors.ForbiddenError();
                }
                return account;
            });
    },

    deleteAccount(accountId, userId) {
        return Account.findOne({ _id: accountId })
            .exec()
            .then(account => {
                if (!account) {
                    throw new Errors.NotFoundError();
                }
                return account;
            })
            .then(account => {
                if (!account.creator.equals(userId)) {
                    throw new Errors.ForbiddenError();
                }
                return account;
            })
            .then(account => account.remove());
    },

    updateAccount(accountId, data, userId) {
        return Account.findOne({ _id: accountId })
            .exec()
            .then(account => {
                if (!account) {
                    throw new Errors.NotFoundError();
                }
                return account;
            })
            .then(account => {
                if (!account.creator.equals(userId)) {
                    throw new Errors.ForbiddenError();
                }
                return account;
            })
            .then(() => Account
                .findByIdAndUpdate(
                    accountId,
                    _.extend(data, {
                        creator: userId
                    }),
                    { new: true })
                .exec()
            );
    }
};
