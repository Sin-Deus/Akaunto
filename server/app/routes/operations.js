const Account = require('../models/Account');
const Operation = require('../models/Operation');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

/**
 * Checks if the specified user has access to the account.
 * @param {object} res The response object.
 * @param {string} accountId The account id.
 * @param {string} userId The user id.
 * @param {*|Account} [returnValue] The optional return value; if not given, will default to the account.
 * @return {q.Promise}
 * @private
 */
function _checkAccount(res, accountId, userId, returnValue) {
    return Account
        .findOne({ _id: accountId })
        .exec()
        .then(account => {
            if (!account) {
                throw new Error();
            }
            return account;
        })
        .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
        .then(account => {
            if (!account.isAllowedUser(userId)) {
                throw new Error();
            }
            return returnValue || account;
        })
        .fail(err => {
            res.sendStatus(HttpStatus.FORBIDDEN);
            throw err;
        });
}

module.exports = router => {
    router.route('/accounts/:accountId/operations/').get((req, res) => {
        _checkAccount(res, req.params.accountId, req.user._id)
            .then(account => Operation
                .find({ account: account._id })
                .sort('-date')
                .exec()
            )
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(operations => res.json(operations));
    });

    router.route('/accounts/:accountId/operations/').post((req, res) => {
        _checkAccount(res, req.params.accountId, req.user._id)
            .then(() => {
                const operation = new Operation(req.body);
                operation.creator = req.user._id;
                operation.account = req.params.accountId;

                return operation.save();
            })
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(operation => res.status(HttpStatus.CREATED).json(operation));
    });

    router.route('/operations/:id').get((req, res) => {
        Operation.findOne({ _id: req.params.id })
            .exec()
            .then(operation => {
                if (!operation) {
                    throw new Error();
                }
                return operation;
            })
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(operation => _checkAccount(res, operation.account, req.user._id, operation))
            .then(operation => res.json(operation));
    });

    router.route('/operations/:id').put((req, res) => {
        Operation.findOne({ _id: req.params.id })
            .exec()
            .then(operation => {
                if (!operation) {
                    throw new Error();
                }
                return operation;
            })
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(operation => {
                _checkAccount(res, operation.account, req.user._id)
                    .then(account => {
                        const newOperation = new Operation(_.extend(operation, req.body, {
                            _id: req.params.id,
                            creator: operation.creator,
                            account: account._id
                        }));
                        newOperation.isNew = false;
                        return newOperation.save();
                    })
                    .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
                    .then(newOperation => res.json(newOperation));
            });
    });

    router.route('/operations/:id').delete((req, res) => {
        Operation.findOne({ _id: req.params.id })
            .exec()
            .then(operation => {
                if (!operation) {
                    throw new Error();
                }
                return operation;
            })
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(operation => {
                _checkAccount(res, operation.account, req.user._id)
                    .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
                    .then(() => operation.remove())
                    .then(() => res.sendStatus(HttpStatus.NO_CONTENT));
            });
    });

    return router;
};
