'use strict';

const User = require('../models/User');

module.exports = router => {
    router.route('/').get((req, res) => {
        User.find({}, (err, users) => res.json(users));
    });

    router.route('/').post((req, res) => {
        let user = new User(req.body);

        // Prevent non-admin users to create admins.
        if (!req.user.isAdmin) {
            user.isAdmin = false;
        }

        user.save(err => {
            if (err) {
                res.sendStatus(400);
            } else {
                res.statusCode(201).json(user);
            }
        })
    });

    router.route('/me').get((req, res) => {
        res.json(req.user);
    });

    router.route('/:id').get((req, res) => {
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err || !user) {
                res.sendStatus(404);
            } else {
                res.json(user);
            }
        });
    });

    router.route('/:id').delete((req, res) => {
        if (!req.user.isAdmin) {
            res.sendStatus(401);
        } else {
            User.findByIdAndRemove(req.params.id, (err) => {
                if (err) {
                    res.sendStatus(404);
                } else {
                    res.sendStatus(204);
                }
            });
        }
    });

    router.route('/:id').put((req, res) => {
        if (!req.user.isAdmin && (req.user._id !== req.params.id)) {
            res.sendStatus(401);
        } else {
            User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
                if (err || !user) {
                    res.sendStatus(400);
                } else {
                    res.json(user);
                }
            });
        }
    });

    return router;
};