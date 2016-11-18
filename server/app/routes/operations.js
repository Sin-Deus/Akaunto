const OperationService = require('../services/OperationService');
const ErrorHandler = require('../utils/ErrorHandler');
const HttpStatus = require('http-status-codes');

module.exports = router => {
    router.route('/accounts/:accountId/operations/').get((req, res) => {
        OperationService
            .getAccountOperations(req.params.accountId, req.user._id)
            .fail(err => ErrorHandler.handle(err, res))
            .then(operations => res.json(operations));
    });

    router.route('/accounts/:accountId/operations/').post((req, res) => {
        OperationService
            .createOperationOnAccount(req.params.accountId, req.user._id, req.body)
            .fail(err => ErrorHandler.handle(err, res))
            .then(operation => res.status(HttpStatus.CREATED).json(operation));
    });

    router.route('/operations/:id').get((req, res) => {
        OperationService
            .getOperation(req.params.id, req.user._id)
            .fail(err => ErrorHandler.handle(err, res))
            .then(operation => res.json(operation));
    });

    router.route('/operations/:id').put((req, res) => {
        OperationService
            .updateOperation(req.params.id, req.user._id, req.body)
            .fail(err => ErrorHandler.handle(err, res))
            .then(newOperation => res.json(newOperation));
    });

    router.route('/operations/:id').delete((req, res) => {
        OperationService
            .deleteOperation(req.params.id, req.user._id)
            .fail(err => ErrorHandler.handle(err, res))
            .then(() => res.sendStatus(HttpStatus.NO_CONTENT));
    });

    return router;
};
