const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovie, deleteMovie, createMovie } = require('../controllers/movies');

const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

router.get('/', getMovie);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteMovie,
);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(urlPattern),
      trailerLink: Joi.string().required().pattern(urlPattern),
      thumbnail: Joi.string().required().pattern(urlPattern),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),

    }),
  }),
  createMovie,
);

module.exports = router;
