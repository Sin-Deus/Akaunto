const Account = require('../models/Account');
const Operation = require('../models/Operation');
const Errors = require('../utils/errors');
const _ = require('lodash');

/**
 * Checks if the specified user has access to the account.
 * @param {string} accountId The account id.
 * @param {string} userId The user id.
 * @param {*|Account} [returnValue] The optional return value; if not given, will default to the account.
 * @return {q.Promise}
 * @private
 * @throw Errors.NotFoundError
 * @throw Errors.ForbiddenError
 */
function _checkAccount(accountId, userId, returnValue) {
    return Account
        .findOne({ _id: accountId })
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
            return returnValue || account;
        });
}

module.exports = {
    getAccountOperations(accountId, userId) {
        return _checkAccount(accountId, userId)
            .then(account => Operation
                .find({ account: account._id })
                .sort('-date')
                .exec()
            );
    },

    createOperationOnAccount(accountId, creatorId, data) {
        return _checkAccount(accountId, creatorId)
            .then(() => {
                const operation = new Operation(data);
                operation.creator = creatorId;
                operation.account = accountId;

                return operation.save();
            });
    },

    getOperation(operationId, userId) {
        return Operation.findOne({ _id: operationId })
            .exec()
            .then(operation => {
                if (!operation) {
                    throw new Errors.NotFoundError();
                }
                return operation;
            })
            .then(operation => _checkAccount(operation.account, userId, operation));
    },

    updateOperation(operationId, userId, data) {
        return Operation.findOne({ _id: operationId })
            .exec()
            .then(operation => {
                if (!operation) {
                    throw new Errors.NotFoundError();
                }
                return operation;
            })
            .then(operation =>
                _checkAccount(operation.account, userId)
                    .then(account => {
                        const newOperation = new Operation(_.extend(operation, data, {
                            _id: operationId,
                            creator: operation.creator,
                            account: account._id
                        }));
                        newOperation.isNew = false;
                        return newOperation.save();
                    })
            );
    },

    deleteOperation(operationId, userId) {
        return Operation.findOne({ _id: operationId })
            .exec()
            .then(operation => {
                if (!operation) {
                    throw new Errors.NotFoundError();
                }
                return operation;
            })
            .then(operation =>
                _checkAccount(operation.account, userId)
                    .then(() => operation.remove())
            );
    }
};
