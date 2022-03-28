const mongoose = require('mongoose');

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
        validator: (v) => /(:?(?:https?:\/\/)?(?:www\.)?)?[-a-z0-9]+\.\w/g.test(v),
        message: 'Некорректный url изображения',
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /(:?(?:https?:\/\/)?(?:www\.)?)?[-a-z0-9]+\.\w/g.test(v),
        message: 'Некорректный url трейлера',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /(:?(?:https?:\/\/)?(?:www\.)?)?[-a-z0-9]+\.\w/g.test(v),
        message: 'Некорректный url миниатюры',
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
