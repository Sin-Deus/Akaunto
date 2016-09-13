'use strict';

const User = require('../models/User');

module.exports = router => {
    router.route('/').get((req, res) => {
        User.find({}, (err, users) => res.json(users));
    });

    return router;
};