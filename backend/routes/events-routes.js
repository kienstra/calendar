const express = require('express');
const { check } = require('express-validator');

const eventsControllers = require('../controllers/events-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', eventsControllers.getEventById);

router.get('/user/:uid', eventsControllers.getEventsByUserId);

// Uses middleware.
router.use(checkAuth);

// This and below are unreachable if middleware blocks request, like from lack of authentication.
router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('start')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  eventsControllers.createEvent
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('start')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  eventsControllers.updateEvent
);

router.delete('/:pid', eventsControllers.deleteEvent);

module.exports = router;
