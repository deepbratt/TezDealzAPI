const express = require('express');
const countryStateProvince = require('../contollers/country-city-province/countryCityProvince');

const router = express.Router();


router
    .route('/all-cities')
    .get(countryStateProvince.getAllCities);


router
    .route('/all-states')
    .get(countryStateProvince.getAllStates);

router
    .route('/cities/country-code/:countrycode')
    .get(countryStateProvince.getCitiesOfCountry);

router
    .route('/cities/state-code/:stateCode/:countryCode')
    .get(countryStateProvince.getCitiesOfState);

router
    .route('/states/state-code/:stateCode')
    .get(countryStateProvince.getStateByCode);

router
    .route('/states/country-code/:stateCode/:countryCode')
    .get(countryStateProvince.getStateByCodeAndCountry);
 
module.exports = router; // export to use in server.js
