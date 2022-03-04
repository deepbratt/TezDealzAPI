const express = require('express');
const User = require('../model/user/userModel');
const { authenticate, checkIsLoggedIn, restrictTo } = require('@auth/tdb-auth');
const { ROLES } = require('@constants/tdb-constants');
const productController = require('../controller/product');
const ratingsController = require('../controller/ratings');
const cartController = require('../controller/cart.js');

const router = express.Router();

//  Adding Product Route
router.route('/add').post(
  // authenticate(User),
  // restrictTo(ROLES.USERROLES.ADMIN, ROLES.USERROLES.MODERATOR),
  productController.addProduct
);

router.route('/list-product').get(productController.listProduct)

router.route('/get-product/:id').get(productController.getProduct)


// Ratings

router.route('/add-review').post(
  // authenticate(User),
  // restrictTo(ROLES.USERROLES.ADMIN, ROLES.USERROLES.MODERATOR),
  ratingsController.addReview
);

router.route('/get-ratings/:id').get(ratingsController.getRatings);

// Cart
router.route('/add-cart').post(cartController.addCart)
router.route('/remove-cart').post(cartController.removeCart)
router.route('/get-cart/:id').get(cartController.getCart)
module.exports = router;