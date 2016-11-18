const AuthenticationService = require('../services/AuthenticationService');
const ErrorHandler = require('../utils/ErrorHandler');
const express = require('express');
const router = express.Router();

router.route('/').post((req, res) => {
    AuthenticationService
        .authenticate(req.body.email, req.body.password)
        .fail(err => ErrorHandler.handle(err, res))
        .then(token => res.json({ token }));
});

module.exports = router;
