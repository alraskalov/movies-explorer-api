const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const { getMovie, deleteMovie, createMovie } = require('../controllers/movies');

const validate = (value, field, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.message(`Поле ${field} заполнено некорректно`);
};

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
      image: Joi.string()
        .required()
        .custom((value, helpers) => validate(value, 'image', helpers)),
      trailerLink: Joi.string()
        .required()
        .custom((value, helpers) => validate(value, 'trailerLink', helpers)),
      thumbnail: Joi.string()
        .required()
        .custom((value, helpers) => validate(value, 'thumbnail', helpers)),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

module.exports = router;
