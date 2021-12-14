const city = require('./data/city.json');
const state = require('./data/state.json');

var _ = require("underscore");

const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');

exports.getAllStates = catchAsync(async (req, res, next) => {

  var result = state;

  if (result[0].length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      result
    },
  });
});


exports.getStateByCode = catchAsync(async (req, res, next) => {

  var result = _.where(state, { isoCode: req.params.stateCode });

  if (result[0].length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      result
    },
  });
});


exports.getStateByCodeAndCountry = catchAsync(async (req, res, next) => {

  var state_code = req.params.stateCode;
  var country_code = req.params.countryCode;

   var result = _.where(state, { countryCode: country_code,  isoCode:state_code});

  if (result[0].length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      result
    },
  });
});

exports.getStatesOfCountry = catchAsync(async (req, res, next) => {

  var result = _.where(state, { countryCode: req.params.countryCode });

  if (result[0].length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      result
    },
  });
});

exports.getAllCities = catchAsync(async (req, res, next) => {

  var result = city;

  if (result[0].length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      result
    },
  });
});

exports.getCitiesOfState = catchAsync(async (req, res, next) => {

  var countryCode_f = req.params.countryCode;
  var stateCode_f = req.params.stateCode;
  var result = _.where(city, { stateCode: stateCode_f, countryCode:countryCode_f})

  if (result[0].length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      result
    },
  });
});

exports.getCitiesOfCountry = catchAsync(async (req, res, next) => {

  
  var result = _.where(city, { countryCode: "PK" });

  if (result[0].length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      result
    },
  });
});

// console.log(_.where(city,{name:x}))