const express = require('express');
const carController = require('../contollers/carController');
const auth = require('../middleware/auth');
const { upload } = require('@utils/tdb_globalutils');
const router = express.Router();

router.route('/cars').get(carController.getAll);
router.use(auth);
router.route('/cars').post(upload('image').array('image', 10), carController.createOne);
router.route('/cars/myCars').get(carController.getMine);
router.route('/cars/add-to-fav/:id').patch(carController.addtoFav);
router.route('/cars/remove-from-fav/:id').patch(carController.removeFromFav);
router.route('/cars/favourites').get(carController.favorites);
router
	.route('/cars/:id')
	.get(carController.getOne)
	.patch(carController.updateOne)
	.delete(carController.deleteOne);

module.exports = router;
