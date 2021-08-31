const carMakeModel = require('../models/carMakeModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const { filter } = require('./factoryHandler');

exports.createMakeModel = catchAsync(async (req, res, next) => {
  await carMakeModel.create(req.body);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
  });
});

exports.getAllMakesModels = catchAsync(async (req, res, next) => {
  const result = await carMakeModel.find();

  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    data: {
      total: result.length,
      result,
    },
  });
});

exports.getMakeModel = catchAsync(async (req, res, next) => {
  const result = await carMakeModel.findById(req.params.id);

  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    data: {
      result,
    },
  });
});

exports.updateMakeModel = catchAsync(async (req, res, next) => {
  // if (req.body.model) {
  //   let array = [];
  //   for (var i = 0; i < req.body.model.length; i++) {
  //     i = array[req.body.model];
  //     array.push(i);
  //   }
  //   console.log(req.body.model);
  //   if (req.body.model) {
  //     req.body.model = [...req.body.model, ...array];
  //   } else {
  //     req.body.model = array;
  //   }
  // }

  const result = await carMakeModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (req.body.model) {
    req.body.model = [];
    for (let i = 0; i < req.body.model.length; i++) {
      let newItems = req.body.model[i];
      req.body.model.push(newItems);
    }
  }

  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
    data: {
      result,
    },
  });
});

exports.deleteMakeModel = catchAsync(async (req, res, next) => {
  const result = await carMakeModel.findByIdAndDelete(req.params.id);

  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE,
  });
});

exports.getAllModels = catchAsync(async (req, res, next) => {
  const result = await filter(carMakeModel.find({ make: req.params.make }), req.query);

  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    data: {
      result,
    },
  });
});
