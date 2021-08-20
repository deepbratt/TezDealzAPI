const express = require('express');
const User = require('../models/userModel');
const carController = require('../contollers/carController');
const { authenticate, checkIsLoggedIn } = require('@auth/tdb-auth');
const { permessionCheck, favPermessionCheck } = require('../middleware/cars/index');
const { upload } = require('@utils/tdb_globalutils');
const router = express.Router();
//const { isCached } = require('../utils/redisCache');

router.route('/cars').get(checkIsLoggedIn(User), carController.getAll);
router
  .route('/cars')
  .post(authenticate(User), upload('image').array('image', 10), carController.createOne);
router.route('/cars/myCars').get(authenticate(User), carController.getMine);

//////////////////////////////FAVOURITES/////////////////////////////////////////
router.route('/cars/favourites').get(authenticate(User), carController.favorites);

router
  .route('/cars/add-to-fav/:id')
  .patch(authenticate(User), favPermessionCheck, carController.addtoFav);
router.route('/cars/remove-from-fav/:id').patch(authenticate(User), carController.removeFromFav);

///////////////////////MARK ACTIVE/SOLD////////////////////////////////////
router
  .route('/cars/mark-sold/:id')
  .patch(authenticate(User), permessionCheck, carController.markSold);
router
  .route('/cars/mark-unsold/:id')
  .patch(authenticate(User), permessionCheck, carController.unmarkSold);
router
  .route('/cars/mark-active/:id')
  .patch(authenticate(User), permessionCheck, carController.markActive);
router
  .route('/cars/mark-inactive/:id')
  .patch(authenticate(User), permessionCheck, carController.unmarkActive);
///////////////////////////////////////////////////////////////////////////////////////

router
  .route('/cars/:id')
  .get(checkIsLoggedIn(User), carController.getOne)
  .patch(
    authenticate(User),
    permessionCheck,
    upload('image').array('image', 10),
    carController.updateOne,
  )
  .delete(authenticate(User), permessionCheck, carController.deleteOne);

module.exports = router;
