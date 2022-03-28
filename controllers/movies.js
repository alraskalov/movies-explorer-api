const Movie = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

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
        throw new NotFoundError('Нет данных по переданному id');
      } else if (req.user._id !== movieObject.owner.toString()) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
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
        next(new ValidationError('Некорректный URL'));
      }
      next(err);
    });
};
