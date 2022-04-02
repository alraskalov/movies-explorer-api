const { SERVER_500_ERROR } = require('../utils/enumError');

module.exports = function errorHandler(err, req, res, next) {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? SERVER_500_ERROR : message,
  });
  next();
};
