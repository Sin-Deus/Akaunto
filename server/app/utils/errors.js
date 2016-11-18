class NotFoundError extends Error {}
class BadRequestError extends Error {}
class ForbiddenError extends Error {}

module.exports.NotFoundError = NotFoundError;
module.exports.BadRequestError = BadRequestError;
module.exports.ForbiddenError = ForbiddenError;
