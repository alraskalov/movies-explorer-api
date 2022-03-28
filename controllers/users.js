const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUserMe = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      const { email, name } = user;
      if (!user) {
        throw new NotFoundError('Нет данных по переданному id');
      } else {
        res.status(200).send({ email, name });
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
        next(
          new ConflictError('Пользователь с таким email уже зарегестрирован'),
        );
      }
      next(err);
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
        throw new NotFoundError({ messgae: 'Нет данных по переданному id' });
      } else {
        res.status(200).send({ name: user.name, email: user.email });
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError('Пользователь с таким email уже зарегестрирован'),
        );
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        {
          expiresIn: '7d',
        },
      );

      res.status(200).send({ token });
    })
    .catch(next);
};