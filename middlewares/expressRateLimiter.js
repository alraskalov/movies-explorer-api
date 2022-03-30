const rateLimit = require('express-rate-limit');
const { RATE_LIMITER } = require('../utils/enumError');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: RATE_LIMITER,
});

module.exports = limiter;
