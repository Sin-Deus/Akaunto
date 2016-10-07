const Account = require('../models/Account');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

module.exports = router => {
    router.route('/accounts/').get((req, res) => {
        Account.find({ creator: req.user._id }, (err, accounts) => {
            if (err) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
            } else {
                res.json(accounts);
            }
        });
    });

    router.route('/accounts/').post((req, res) => {
        const account = new Account(req.body);
        account.creator = req.user._id;

        account.save(err => {
            if (err) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
            } else {
                res.status(HttpStatus.CREATED).json(account);
            }
        });
    });

    router.route('/accounts/:id').get((req, res) => {
        Account.findOne({ _id: req.params.id }, (err, account) => {
            if (err || !account) {
                res.sendStatus(HttpStatus.NOT_FOUND);
            } else if (!account.creator.equals(req.user._id)) {
                res.sendStatus(HttpStatus.FORBIDDEN);
            } else {
                res.json(account);
            }
        });
    });

    router.route('/accounts/:id').delete((req, res) => {
        Account.findOne({ _id: req.params.id }, (err, account) => {
            if (err || !account) {
                res.sendStatus(HttpStatus.NOT_FOUND);
            } else if (!account.creator.equals(req.user._id)) {
                res.sendStatus(HttpStatus.FORBIDDEN);
            } else {
                account.remove(removeErr => {
                    if (removeErr) {
                        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
                    } else {
                        res.sendStatus(HttpStatus.NO_CONTENT);
                    }
                });
            }
        });
    });

    router.route('/accounts/:id').put((req, res) => {
        Account.findOne({ _id: req.params.id }, (err, account) => {
            if (err || !account) {
                res.sendStatus(HttpStatus.NOT_FOUND);
            } else if (!account.creator.equals(req.user._id)) {
                res.sendStatus(HttpStatus.FORBIDDEN);
            } else {
                Account.findByIdAndUpdate(
                    req.params.id,
                    _.merge(req.body, { creator: req.user._id }),
                    { new: true },
                    (updateErr, updatedAccount) => {
                        if (updateErr) {
                            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
                        } else {
                            res.json(updatedAccount);
                        }
                    }
                );
            }
        });
    });

    return router;
};
