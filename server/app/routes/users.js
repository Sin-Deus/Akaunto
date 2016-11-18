const UserService = require('../services/UserService');
const ErrorHandler = require('../utils/ErrorHandler');
const HttpStatus = require('http-status-codes');

module.exports = router => {
    router.route('/users/').get((req, res) => {
        UserService
            .getUsers(req.query.filter)
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(users => res.json(users));
    });

    router.route('/users/').post((req, res) => {
        if (!req.user.isAdmin) {
            res.sendStatus(HttpStatus.FORBIDDEN);
        } else {
            UserService
                .createUser(req.body)
                .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
                .then(user => res.status(HttpStatus.CREATED).json(user));
        }
    });

    router.route('/users/me').get((req, res) => {
        res.json(req.user);
    });

    router.route('/users/me').put((req, res) => {
        UserService
            .updateUser(req.user._id, req.body)
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(user => res.json(user));
    });

    router.route('/users/:id').get((req, res) => {
        UserService
            .getUser(req.params.id)
            .fail(err => ErrorHandler.handle(err, res))
            .then(user => res.json(user));
    });

    router.route('/users/:id').delete((req, res) => {
        if (!req.user.isAdmin) {
            res.sendStatus(HttpStatus.FORBIDDEN);
        } else {
            UserService
                .deleteUser(req.params.id)
                .fail(err => ErrorHandler.handle(err, res))
                .then(() => res.sendStatus(HttpStatus.NO_CONTENT));
        }
    });

    router.route('/users/:id').put((req, res) => {
        if (!req.user.isAdmin && !req.user._id.equals(req.params.id)) {
            res.sendStatus(HttpStatus.FORBIDDEN);
        } else {
            UserService
                .updateUser(req.params.id, req.body)
                .fail(err => ErrorHandler.handle(err, res))
                .then(user => res.json(user));
        }
    });

    return router;
};
