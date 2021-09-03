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

// Total owners
router.route('/cars/owners').get(adminController.getAllOwners);

////////////////////////////// CAR MAKE MODEL ////////////////////////////////////////

// To Get all makes of specific Make
router.get('/cars/makes', cache(cacheExp), carMakeModelController.getAllMakes);

// models with specific make.
router.get('/cars/models', cache(cacheExp), carMakeModelController.getModels);

router.get('/cars/versions', cache(cacheExp), carMakeModelController.getVersions);

// To remove Model in models array by finding with Id.
// router.patch('/cars/remove-model/:id', carMakeModelController.removeFromModel);

// router
// 	.route('/cars/make-model')
// 	.get(carMakeModelController.getAllMakesModels)
// 	.post(carMakeModelController.createMakeModel);
// router
// 	.route('/cars/make-model/:id')
// 	.get(carMakeModelController.getMakeModel)
// 	.patch(carMakeModelController.updateMakeModel)
// 	.delete(carMakeModelController.deleteMakeModel);

////////////////////////////////////////////////////////////////////////////////////////////

// router
//   .route('/cars')
//   .post(authenticate(User), upload('image').array('image', 20), carController.createOne);
// router.route('/cars').get(checkIsLoggedIn(User), carController.getAll);
// router.route('/cars/myCars').get(authenticate(User), carController.getMine);

router
  .route('/cars')
  .post(
    authenticate(User),
    phoneCheck,
    upload('image').array('image', 20),
    carController.createOne,
  );
router.route('/cars').get(checkIsLoggedIn(User), cache(cacheExp), carController.getAll);
router.route('/cars/myCars').get(authenticate(User), cache(cacheExp), carController.getMine);

//////////////////////////////FAVOURITES/////////////////////////////////////////
router.route('/cars/favourites').get(authenticate(User), cache(cacheExp), carController.favorites);

router
  .route('/cars/add-to-fav/:id')
  .patch(authenticate(User), favPermessionCheck, carController.addtoFav);
router.route('/cars/remove-from-fav/:id').patch(authenticate(User), carController.removeFromFav);

///////////////////////MARK ACTIVE/SOLD////////////////////////////////////
router
  .route('/cars/mark-sold/:id')
  .patch(authenticate(User), cache(cacheExp), permessionCheck, carController.markSold);
router
  .route('/cars/mark-unsold/:id')
  .patch(authenticate(User), cache(cacheExp), permessionCheck, carController.unmarkSold);
router
  .route('/cars/mark-active/:id')
  .patch(authenticate(User), cache(cacheExp), permessionCheck, carController.markActive);
router
  .route('/cars/mark-inactive/:id')
  .patch(authenticate(User), cache(cacheExp), permessionCheck, carController.unmarkActive);
///////////////////////////////////////////////////////////////////////////////////////
router.route('/cars/stats').get(authenticate(User), carController.carStats);
router.route('/cars/daily-stats/:min/:max').get(authenticate(User), carController.carDailyStats);
//router.route('/cars/daily-stats/:min/:max').get(authenticate(User), carController.carDailyStats);
router
  .route('/cars/ban/:id')
  .patch(authenticate(User), restrictTo('Admin', 'Moderartor'), carController.markbanned);
router
  .route('/cars/unban/:id')
  .patch(authenticate(User), restrictTo('Admin', 'Moderartor'), carController.markunbanned);
/////////////////////////////////////////////////////////////////////////////////////////////
router
  .route('/cars/:id')
  .get(checkIsLoggedIn(User), cache(cacheExp), carController.getOne)
  .patch(
    authenticate(User),
    phoneCheck,
    permessionCheck,
    upload('image').array('image', 20),
    carController.updateOne,
  )
  .delete(authenticate(User), permessionCheck, carController.deleteOne);
/////////////////////////////////////////////////////////////////////////////////////////////
//city filter
////////////////////////////////////////////////////////////////////////////////////////////
router.route('/cars/filter/cities-with-cars').get(cache(cacheExp), carFilters.getCitiesByProvince);

module.exports = router;
