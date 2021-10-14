const express = require('express');
const User = require('../models/User/userModel');
const appointmentsController = require('../controllers/appointments/appointmentsController');
const { checkIsLoggedIn, authenticate, restrictTo } = require('@auth/tdb-auth');

const router = express.Router();

router.post('/', checkIsLoggedIn(User), appointmentsController.createAppointment);

router.use(authenticate(User));

router.get('/my-appointments', appointmentsController.getMine);

router.get('/', restrictTo('Admin', 'Moderator'), appointmentsController.getAllAppointments);

router
  .route('/:id')
  .get(restrictTo('Admin', 'Moderator'), appointmentsController.getOneAppointment)
  .patch(restrictTo('Admin', 'Moderator'), appointmentsController.updateAppointment)
  .delete(restrictTo('Admin', 'Moderator'), appointmentsController.deleteAppointment);

module.exports = router;
