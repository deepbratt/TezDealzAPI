const express = require('express');
const User = require('../models/User/userModel');
const appointmentsController = require('../controllers/appointments/appointmentsController');
const { checkIsLoggedIn, authenticate, restrictTo } = require('@auth/tdb-auth');

const router = express.Router();

router
  .route('/')
  .get(authenticate('Admin', 'Moderator'), appointmentsController.getAllAppointments)
  .post(checkIsLoggedIn(User), appointmentsController.createAppointment);

router.use(authenticate('Admin', 'Moderator'));

router
  .route('/:id')
  .get(appointmentsController.getOneAppointment)
  .patch(appointmentsController.updateAppointment)
  .delete(appointmentsController.deleteAppointment);
module.exports = router;
