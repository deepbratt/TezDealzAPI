const Car = require('../../models/cars/carModel');
// const User = require('../../models/user/userModel');
const ShowNumber = require('../../models/cars/number-viewed/showNumberModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const { filter } = require('../factory/factoryHandler');



// Importing log files
var log4js = require("log4js");
log4js.configure({
  "appenders": {
    "app": { "type": "file", "filename": "../../app.log" }
  },
  "categories": {
    "default": {
      "appenders": ["app"],
      "level": "all"
    }
  }
});
var logger = log4js.getLogger("Ads");



exports.createShowNumberDetails = catchAsync(async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    const details = {
      seller_details: car.createdBy,
      buyer_details: req.user._id,
      car_details: car._id,
    };
  }
  catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
  }

  if (
    !(await ShowNumber.findOne({
      seller_details: car.createdBy,
      buyer_details: req.user._id,
      car_details: car._id,
    }))
  ) {
    try {


      const result = await ShowNumber.create(details);
    }

    catch (e) {
      logger.error("Custom Error Message")
      logger.trace("Something unexpected has occured.", e)
    }

    res.status(STATUS_CODE.CREATED).json({
      status: STATUS.SUCCESS,
      message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
      data: {
        result,
      },
    });
  } else {
    res.status(STATUS_CODE.OK).json({
      status: STATUS.SUCCESS,
      message: 'Details Already Saved',
    });
  }
});

exports.getAllShowNumberData = catchAsync(async (req, res, next) => {
  try {
    const [result, totalCount] = await filter(
      ShowNumber.find().populate([
        {
          path: 'buyer_details',
          model: 'User',
          select: 'firstName lastName phone',
        },
        {
          path: 'car_details',
          model: 'Car',
          select: 'make model modelYear',
        },
      ]),
      req.query,
    );

    if (result.length <= 0) {
      logger.error("Custom Error Message")
      return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
  }
  catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    countOnPage: result.length,
    totalCount: totalCount,
    data: {
      result,
    },
  });
});

exports.getOneShowNumberDetail = catchAsync(async (req, res, next) => {
  try {
    const result = await ShowNumber.findById(req.params.id).populate([
      {
        path: 'buyer_details',
        model: 'User',
      },
      {
        path: 'car_details',
        model: 'Car',
      },
      {
        path: 'seller_details',
        model: 'User',
      },
    ]);

    if (!result) {
      logger.error("Custom Error Message")
      return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
  }
  catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    data: {
      result,
    },
  });
});

exports.updateShowNumberDetails = catchAsync(async (req, res, next) => {
  try {
    const result = await ShowNumber.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      logger.error("Custom Error Message")
      return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
  }
  catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
    data: {
      result,
    },
  });
});

exports.deleteShowNumberDetails = catchAsync(async (req, res, next) => {
  try {
    const result = await ShowNumber.findByIdAndDelete(req.params.id);

    if (!result) {
      logger.error("Custom Error Message")
      return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
  }
  catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE,
  });
});

exports.getAllLogsOfOneAd = catchAsync(async (req, res, next) => {
  try {
    const [result, totalCount] = await filter(
      ShowNumber.find({ car_details: req.params.id }).populate([
        {
          path: 'buyer_details',
          model: 'User',
          select: 'firstName lastName phone',
        },
        {
          path: 'car_details',
          model: 'Car',
          select: 'make model modelYear',
        },
      ]),
      req.query,
    );

    if (!result) {
      logger.error("Custom Error Message")
      return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
  }
  catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    countOnPage: result.length,
    totalCount: totalCount,
    data: {
      result,
    },
  });
});

// exports.addToShowNumberOfAd = catchAsync(async (req, res, next) => {
//   if (!(await Car.findById(req.params.id))) {
//     return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
//   }

//   if (req.user.showNumberOfAd.includes(req.params.id)) {
//     res.status(STATUS_CODE.OK).json({
//       status: STATUS.SUCCESS,
//       message: 'This Add ID is Already Added',
//     });
//   } else {
//     await User.updateOne({ _id: req.user._id }, { $push: { showNumberOfAd: req.params.id } });

//     res.status(STATUS_CODE.OK).json({
//       status: STATUS.SUCCESS,
//       message: 'Details Added of this Ad!!!',
//     });
//   }
// });