const Account = require('../models/Account');
const Operation = require('../models/Operation');
const HttpStatus = require('http-status-codes');

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
        .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
        .then(account => {
            if (!account.isAllowedUser(userId)) {
                throw new Error();
            }
            return returnValue || account;
        })
        .fail(() => res.sendStatus(HttpStatus.FORBIDDEN));
}

module.exports = router => {
    router.route('/accounts/:accountId/operations/').get((req, res) => {
        _checkAccount(res, req.params.accountId, req.user._id)
            .then(account => Operation.find({ account: account._id }))
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
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(operation => _checkAccount(res, operation.account, req.user._id, operation))
            .then(operation => res.json(operation));
    });

    router.route('/operations/:id').put((req, res) => {
        Operation.findOne({ _id: req.params.id })
            .exec()
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(operation => {
                if (!operation.creator.equals(req.user._id)) {
                    throw new Error();
                }
                return operation;
            })
            .fail(() => res.sendStatus(HttpStatus.FORBIDDEN))
            .then(operation => _checkAccount(res, operation.account, req.user._id))
            .then(account => {
                const operation = new Operation(req.body);
                operation._id = req.params.id;
                operation.creator = req.user._id;
                operation.account = account._id;
                operation.isNew = false;
                return operation.save();
            })
            .fail(() => res.status(HttpStatus.BAD_REQUEST))
            .then(operation => res.json(operation));
    });

    router.route('/operations/:id').delete((req, res) => {
        Operation.findOne({ _id: req.params.id })
            .exec()
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(operation => {
                if (!operation.creator.equals(req.user._id)) {
                    throw new Error();
                }
                return operation.remove();
            })
            .fail(() => res.sendStatus(HttpStatus.FORBIDDEN))
            .then(() => res.sendStatus(HttpStatus.NO_CONTENT));
    });

    return router;
};
