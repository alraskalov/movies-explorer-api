/* eslint-disable consistent-return */
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { AUTHORIZATION_REQUIRED } = require('../utils/enumError');
const { JWT_DEV } = require('../utils/configure');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(AUTHORIZATION_REQUIRED);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
    );
  } catch (err) {
    throw new AuthError(AUTHORIZATION_REQUIRED);
  }

  req.user = payload;

  next();
};
