const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const { NOT_FOUND_ID, USER_IS_NOT_UNIQUE } = require('../utils/enumError');
const { JWT_DEV } = require('../utils/configure');

module.exports.getUserMe = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_ID);
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  User.create({
    email,
    password: hash,
    name,
  })
    .then((user) => res.status(200).send({ _id: user.id, email: user.email }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(USER_IS_NOT_UNIQUE));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_ID);
      } else {
        res.status(200).send({ name: user.name, email: user.email });
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(USER_IS_NOT_UNIQUE));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
        {
          expiresIn: '7d',
        },
      );

      res.status(200).send({ token });
    })
    .catch(next);
};
