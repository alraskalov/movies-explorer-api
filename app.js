require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./routes');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { SERVER_500_ERROR, NOT_FOUND_RESOURCE } = require('./utils/enumError');
const { MONGO_URL } = require('./utils/configure');
const limiter = require('./middlewares/expressRateLimiter');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_RESOURCE));
}, auth);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? SERVER_500_ERROR : message,
  });
  next();
});

app.listen(PORT, () => {});
