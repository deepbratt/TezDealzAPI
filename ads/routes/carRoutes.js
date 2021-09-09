const express = require('express');
const User = require('../models/user/userModel');
const carController = require('../contollers/cars/carController');
const carMakeModelController = require('../contollers/cars/makeModelController');
const adminController = require('../contollers/admin/adminController');
const carFilters = require('../contollers/cars/carFilters');
const { authenticate, checkIsLoggedIn, restrictTo } = require('@auth/tdb-auth');
const { permessionCheck, favPermessionCheck, phoneCheck } = require('../middleware/cars/index');
const { upload } = require('@utils/tdb_globalutils');
const cache = require('../utils/cache');
const cacheExp = 30;
const router = express.Router();
// const { isCached } = require('../utils/redisCache');

/////////////////////////////////// Admin Routes ////////////////////////////

router
	.route('/car-owners-stats')
	.get(authenticate(User), restrictTo('Admin', 'Moderator'), adminController.carOwners);
router
	.route('/cars-stats')
	.get(authenticate(User), restrictTo('Admin', 'Moderator'), adminController.cars); 
router
	.route('/ban/:id')
	.patch(authenticate(User), restrictTo('Admin', 'Moderator'), carController.markbanned);
router
	.route('/unban/:id')
	.patch(authenticate(User), restrictTo('Admin', 'Moderator'), carController.markunbanned);
////////////////////////////// CAR MAKE MODEL ////////////////////////////////////////

// To Get all makes of specific Make
router.get('/makes', cache(cacheExp), carMakeModelController.getAllMakes);

// models with specific make.
router.get('/models', cache(cacheExp), carMakeModelController.getModels);

router.get('/versions', cache(cacheExp), carMakeModelController.getVersions);

////////////////////////////////////////////////////////////////////////////////////////////////////

router
	.route('/')
	.post(authenticate(User), phoneCheck, upload('image').array('image', 20), carController.createOne);
router.route('/').get(checkIsLoggedIn(User), cache(cacheExp), carController.getAll);
router.route('/myCars').get(authenticate(User), cache(cacheExp), carController.getMine);

//////////////////////////////FAVOURITES/////////////////////////////////////////
router.route('/favourites').get(authenticate(User), cache(cacheExp), carController.favorites);

router
	.route('/add-to-fav/:id')
	.patch(authenticate(User), favPermessionCheck, carController.addtoFav);
router.route('/remove-from-fav/:id').patch(authenticate(User), carController.removeFromFav);

///////////////////////MARK ACTIVE/SOLD////////////////////////////////////
router
	.route('/mark-sold/:id')
	.patch(authenticate(User), cache(cacheExp), permessionCheck, carController.markSold);
router
	.route('/mark-unsold/:id')
	.patch(authenticate(User), cache(cacheExp), permessionCheck, carController.unmarkSold);
router
	.route('/mark-active/:id')
	.patch(authenticate(User), cache(cacheExp), permessionCheck, carController.markActive);
router
	.route('/mark-inactive/:id')
	.patch(authenticate(User), cache(cacheExp), permessionCheck, carController.unmarkActive);
/////////////////////////////////////////////////////////////////////////////////////////////
router
	.route('/:id')
	.get(checkIsLoggedIn(User), cache(cacheExp), carController.getOne)
	.patch(
		authenticate(User),
		phoneCheck,
		permessionCheck,
		upload('image').array('image', 20),
		carController.updateOne
	)
	.delete(authenticate(User), permessionCheck, carController.deleteOne);
/////////////////////////////////////////////////////////////////////////////////////////////
//city filter
////////////////////////////////////////////////////////////////////////////////////////////
router.route('/filter/cities-with-cars').get(cache(cacheExp), carFilters.getCitiesByProvince);

module.exports = router;

// To remove Model in models array by finding with Id.
// router.patch('/remove-model/:id', carMakeModelController.removeFromModel);

// router
// 	.route('/make-model')
// 	.get(carMakeModelController.getAllMakesModels)
// 	.post(carMakeModelController.createMakeModel);
// router
// 	.route('/make-model/:id')
// 	.get(carMakeModelController.getMakeModel)
// 	.patch(carMakeModelController.updateMakeModel)
// 	.delete(carMakeModelController.deleteMakeModel);

////////////////////////////////////////////////////////////////////////////////////////////

// router
//   .route('/cars')
//   .post(authenticate(User), upload('image').array('image', 20), carController.createOne);
// router.route('/cars').get(checkIsLoggedIn(User), carController.getAll);
// router.route('/cars/myCars').get(authenticate(User), carController.getMine);

//router.route('/stats').get(authenticate(User), carController.carStats);
//router.route('/daily-stats/:min/:max').get(authenticate(User), carController.carDailyStats);
//router.route('/cars/daily-stats/:min/:max').get(authenticate(User), carController.carDailyStats);
