const User = require('../models/User');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const Q = require('q');

/**
 * Updates the given user with the request body, optionally encrypting the password if it's present.
 * @param {string} userId
 * @param {object} req
 * @param {object} res
 * @return {Promise<Object>}
 * @private
 */
function _updateUser(userId, req, res) {
    return Q.fcall(() => {
        Reflect.deleteProperty(req.body, 'update');
        Reflect.deleteProperty(req.body, 'isAdmin');
        if (req.body.password) {
            return User.encryptPassword(req.body);
        }
        return req.body;
    })
        .then(user => User.findByIdAndUpdate(userId, user, { new: true }).exec())
        .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
        .then(user => res.json(user));
}

module.exports = router => {
    router.route('/users/').get((req, res) => {
        const filter = {};

        if (req.query.filter) {
            filter.$or = [];
            _.each(['firstName', 'lastName'], attr => filter.$or.push({ [attr]: new RegExp(req.query.filter, 'i') }));
        }

        User.find(filter)
            .exec()
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(users => res.json(users));
    });

    router.route('/users/').post((req, res) => {
        const user = new User(req.body);

        // Prevent non-admin users to create admins.
        if (!req.user.isAdmin) {
            user.isAdmin = false;
        }

        user.save()
            .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
            .then(newUser => res.statusCode(HttpStatus.CREATED).json(newUser));
    });

    router.route('/users/me').get((req, res) => {
        res.json(req.user);
    });

    router.route('/users/me').put((req, res) => {
        _updateUser(req.user._id, req, res);
    });

    router.route('/users/:id').get((req, res) => {
        User.findOne({ _id: req.params.id })
            .exec()
            .then(user => {
                if (!user) {
                    throw new Error();
                }
                return user;
            })
            .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
            .then(user => res.json(user));
    });

    router.route('/users/:id').delete((req, res) => {
        if (!req.user.isAdmin) {
            res.sendStatus(HttpStatus.FORBIDDEN);
        } else {
            User.findByIdAndRemove(req.params.id)
                .exec()
                .fail(() => res.sendStatus(HttpStatus.BAD_REQUEST))
                .then(user => {
                    if (!user) {
                        throw new Error();
                    }
                    return user;
                })
                .fail(() => res.sendStatus(HttpStatus.NOT_FOUND))
                .then(() => res.sendStatus(HttpStatus.NO_CONTENT));
        }
    });

    router.route('/users/:id').put((req, res) => {
        if (!req.user.isAdmin && !req.user._id.equals(req.params.id)) {
            res.sendStatus(HttpStatus.FORBIDDEN);
        } else {
            _updateUser(req.params.id, req, res);
        }
    });

    return router;
};
