const Movie = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const { NOT_FOUND_ID, DELETE_OTHER_MOVIE, INVALID_URL } = require('../utils/enumError');

module.exports.getMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .select('+owner')
    .then((movieObject) => {
      if (!movieObject) {
        throw new NotFoundError(NOT_FOUND_ID);
      } else if (req.user._id !== movieObject.owner.toString()) {
        throw new ForbiddenError(DELETE_OTHER_MOVIE);
      }
      Movie.findByIdAndRemove(movieId)
        .then((movie) => {
          res.status(200).send(movie);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then(() => {
      res.status(200).send({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(INVALID_URL));
      }
      next(err);
    });
};
