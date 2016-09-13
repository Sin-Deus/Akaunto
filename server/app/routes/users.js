'use strict';

const User = require('../models/User');

module.exports = router => {
    router.route('/').get((req, res) => {
        User.find({}, (err, users) => res.json(users));
    });

    router.route('/').post((req, res) => {
        let user = new User(req.body);

        user.save(err => {
            if (err) {
                res.sendStatus(400);
            } else {
                res.json(user);
            }
        })
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

    router.route('/:id').put((req, res) => {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
            if (err || !user) {
                res.sendStatus(400);
            } else {
                res.json(user);
            }
        });
    });

    return router;
};