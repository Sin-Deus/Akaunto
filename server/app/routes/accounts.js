const AccountService = require('../services/AccountService');
const ErrorHandler = require('../utils/ErrorHandler');
const HttpStatus = require('http-status-codes');

module.exports = router => {
    router.route('/accounts/').get((req, res) => {
        AccountService
            .getAccounts(req.user._id)
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(accounts => res.json(accounts));
    });

    router.route('/accounts/').post((req, res) => {
        AccountService
            .createAccount(req.body, req.user._id)
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(account => res.status(HttpStatus.CREATED).json(account));
    });

    router.route('/accounts/:id').get((req, res) => {
        AccountService.getAccount(req.params.id, req.user._id)
            .fail(err => ErrorHandler.handle(err, res))
            .then(account => res.json(account));
    });

    router.route('/accounts/:id').delete((req, res) => {
        AccountService.deleteAccount(req.params.id, req.user._id)
            .fail(err => ErrorHandler.handle(err, res))
            .then(() => res.sendStatus(HttpStatus.NO_CONTENT));
    });

    router.route('/accounts/:id').put((req, res) => {
        AccountService.updateAccount(req.params.id, req.body, req.user._id)
            .fail(err => ErrorHandler.handle(err, res))
            .then(account => res.json(account));
    });

    return router;
};
