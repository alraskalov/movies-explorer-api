const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const AuthError = require('../errors/AuthError');
const {
  INCORRECT_MAIL_FORMAT,
  INCORRECT_EMAIL_OR_PASSWORD,
} = require('../utils/enumError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: INCORRECT_MAIL_FORMAT,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError(INCORRECT_EMAIL_OR_PASSWORD));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthError(INCORRECT_EMAIL_OR_PASSWORD));
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
