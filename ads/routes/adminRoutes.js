// Total owners
const express = require('express');
const router = express.Router();
const adminController = require('../contollers/admin/adminController');

router.route('/owners').get(adminController.totalOwners);
router.route('/total-cars').get(adminController.totalCars);
router.route('/cars-monthly-stats').get(adminController.carsMonthlyStats);

module.exports = router;
