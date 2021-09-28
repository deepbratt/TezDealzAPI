const express = require('express');
const User = require('../models/user/userModel');
const ticketController = require('../contollers/ticket/ticketController');
const { authenticate, checkIsLoggedIn, restrictTo } = require('@auth/tdb-auth');
//const cache = require('../utils/cache');
//const cacheExp = 30;
const router = express.Router();

router.post(
	'/techAssistance',
	checkIsLoggedIn(User),
	//cache(cacheExp),
	ticketController.createTechAssistance
);

router.use(authenticate(User));

router.post(
	'/advAssistance',
	restrictTo('User'),
	//cache(cacheExp),
	ticketController.createAdvAssistance
);

router.use(restrictTo('Admin', 'Moderator'));

router.get(
	'/', 
  //cache(cacheExp),
	ticketController.getAll
);
router.patch('/close/:id', ticketController.closeTicket);
router
	.route('/:id')
	.get(ticketController.getOne)
	.patch(ticketController.updateOne)
	.delete(ticketController.deleteOne);

module.exports = router;
