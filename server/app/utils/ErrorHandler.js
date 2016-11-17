const HttpStatus = require('http-status-codes');
const Errors = require('./errors');

module.exports.handle = (err, res) => {
    if (err instanceof Errors.NotFoundError) {
        res.sendStatus(HttpStatus.NOT_FOUND);
    } else if (err instanceof Errors.ForbiddenError) {
        res.sendStatus(HttpStatus.FORBIDDEN);
    }
};
