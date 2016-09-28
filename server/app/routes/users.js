const User = require('../models/User');
const HttpStatus = require('http-status-codes');

module.exports = router => {
    router.route('/').get((req, res) => {
        User.find({}, (err, users) => {
            if (err) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
            } else {
                res.json(users);
            }
        });
    });

    router.route('/').post((req, res) => {
        const user = new User(req.body);

        // Prevent non-admin users to create admins.
        if (!req.user.isAdmin) {
            user.isAdmin = false;
        }

        user.save(err => {
            if (err) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
            } else {
                res.statusCode(HttpStatus.CREATED).json(user);
            }
        });
    });

    router.route('/me').get((req, res) => {
        res.json(req.user);
    });

    router.route('/me').put((req, res) => {
        User.findByIdAndUpdate(req.user._id, req.body, { new: true }, (err, user) => {
            if (err || !user) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
            } else {
                res.json(user);
            }
        });
    });

    router.route('/:id').get((req, res) => {
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err || !user) {
                res.sendStatus(HttpStatus.NOT_FOUND);
            } else {
                res.json(user);
            }
        });
    });

    router.route('/:id').delete((req, res) => {
        if (!req.user.isAdmin) {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        } else {
            User.findByIdAndRemove(req.params.id, err => {
                if (err) {
                    res.sendStatus(HttpStatus.NOT_FOUND);
                } else {
                    res.sendStatus(HttpStatus.NO_CONTENT);
                }
            });
        }
    });

    router.route('/:id').put((req, res) => {
        if (!req.user.isAdmin && req.user._id !== req.params.id) {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        } else {
            User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
                if (err || !user) {
                    res.sendStatus(HttpStatus.BAD_REQUEST);
                } else {
                    res.json(user);
                }
            });
        }
    });

    return router;
};
