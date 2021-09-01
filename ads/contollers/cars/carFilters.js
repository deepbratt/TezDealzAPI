const Car = require('../../models/carModel');

const { citiesByProvince } = require('../factory/factoryHandler');

exports.getCitiesByProvince = citiesByProvince(Car);
