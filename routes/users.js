const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserMe, updateUserProfile } = require('../controllers/users');

router.get('/me', getUserMe);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUserProfile,
);

module.exports = router;
