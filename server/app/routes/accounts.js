const Account = require('../models/Account');
const HttpStatus = require('http-status-codes');

module.exports = router => {
    router.route('/accounts/').get((req, res) => {
        Account.find({ $or: [
                { creator: req.user._id },
                { users: { $in: [req.user._id] }
            }] })
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
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(account => {
                if (!account.creator.equals(req.user._id)) {
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
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(account => {
                if (!account.creator.equals(req.user._id)) {
                    throw new Error();
                }
                return account;
            })
            .fail(() => res.sendStatus(HttpStatus.FORBIDDEN))
            .then(account => account.remove())
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(() => res.sendStatus(HttpStatus.NO_CONTENT));
    });

    router.route('/accounts/:id').put((req, res) => {
        Account.findOne({ _id: req.params.id })
            .exec()
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(account => {
                if (!account.creator.equals(req.user._id)) {
                    throw new Error();
                }
                return account;
            })
            .fail(() => res.sendStatus(HttpStatus.FORBIDDEN))
            .then(() => {
                const account = new Account(req.body);
                account._id = req.params.id;
                account.creator = req.user._id;
                account.isNew = false;
                return account.save();
            })
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(account => res.json(account));
    });

    return router;
};
