const Account = require('../models/Account');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

module.exports = router => {
    router.route('/accounts/').get((req, res) => {
        Account.find({ $or: [
                { creator: req.user._id },
                { users: { $in: [req.user._id] }
            }] })
            .sort('name')
            .exec()
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(accounts => res.json(accounts));
    });

    router.route('/accounts/').post((req, res) => {
        const account = new Account(req.body);
        account.creator = req.user._id;

        account.save()
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(() => res.status(HttpStatus.CREATED).json(account));
    });

    router.route('/accounts/:id').get((req, res) => {
        Account.findOne({ _id: req.params.id })
            .populate('users')
            .exec()
            .then(account => {
                if (!account) {
                    throw new Error();
                }
                return account;
            })
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(account => {
                if (!account.isAllowedUser(req.user._id)) {
                    throw new Error();
                }
                return account;
            })
            .fail(() => res.sendStatus(HttpStatus.FORBIDDEN))
            .then(account => res.json(account));
    });

    router.route('/accounts/:id').delete((req, res) => {
        Account.findOne({ _id: req.params.id })
            .exec()
            .then(account => {
                if (!account) {
                    throw new Error();
                }
                return account;
            })
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(account => {
                if (!account.creator.equals(req.user._id)) {
                    throw new Error();
                } else {
                    account
                        .remove()
                        .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
                        .then(() => res.sendStatus(HttpStatus.NO_CONTENT));
                }
            })
            .fail(() => res.sendStatus(HttpStatus.FORBIDDEN));
    });

    router.route('/accounts/:id').put((req, res) => {
        Account.findOne({ _id: req.params.id })
            .exec()
            .then(account => {
                if (!account) {
                    throw new Error();
                }
                return account;
            })
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(account => {
                if (!account.creator.equals(req.user._id)) {
                    throw new Error();
                } else {
                    Account
                        .findByIdAndUpdate(
                            req.params.id,
                            _.extend(req.body, {
                                creator: req.user._id
                            }),
                            { new: true })
                        .exec()
                        .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
                        .then(updatedAccount => res.json(updatedAccount));
                }
            })
            .fail(() => res.sendStatus(HttpStatus.FORBIDDEN));
    });

    return router;
};
