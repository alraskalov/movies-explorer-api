const mongoose = require('mongoose');
const {
  INVALID_IMAGE_URL,
  INVALID_TRAILER_URL,
  INVALID_THUMBNAIL_URL,
} = require('../utils/enumError');

const validator = /(:?(?:https?:\/\/)?(?:www\.)?)?[-a-z0-9]+\.\w/g;

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.test(v),
        message: INVALID_IMAGE_URL,
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.test(v),
        message: INVALID_TRAILER_URL,
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.test(v),
        message: INVALID_THUMBNAIL_URL,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
