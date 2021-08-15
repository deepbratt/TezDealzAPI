const Car = require('../models/carModel');
const {
  AppError,
  catchAsync,
  uploadS3,
  APIFeatures,
} = require('@utils/tdb_globalutils');
const {
  ERRORS,
  STATUS,
  STATUS_CODE,
  SUCCESS_MSG,
} = require('@constants/tdb-constants');
const { filter } = require('./factoryHandler');

exports.createOne = catchAsync(async (req, res, next) => {
  if (req.files) {
    let array = [];
    for (var i = 0; i < req.files.length; i++) {
      let { Location } = await uploadS3(
        req.files[i],
        process.env.AWS_BUCKET_REGION,
        process.env.AWS_ACCESS_KEY,
        process.env.AWS_SECRET_KEY,
        process.env.AWS_BUCKET_NAME,
      );
      array.push(Location);
    }
    req.body.image = array;
  }
  req.body.createdBy = req.user._id;
  const result = await Car.create(req.body);
  if (!result)
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    data: {
      result,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const [result, totalCount] = await filter(Car.find(), req.query);

  if (result.length === 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
  if (req.user) {
    for (var i = 0; i < result.length; i++) {
      if (
        result[i].favOf.length > 0 &&
        result[i].favOf.includes(req.user._id)
      ) {
        result[i].isFav = true;
      } else {
        result[i].isFav = false;
      }
    }
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

exports.getOne = catchAsync(async (req, res, next) => {
  const result = await Car.findById(req.params.id).populate('createdBy');
  if (!result)
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  if (req.user) {
    if (result.favOf.includes(req.user._id)) {
      result.isFav = true;
    } else {
      result.isFav = false;
    }
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    data: {
      result,
    },
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  if (req.files) {
    let array = [];
    for (var i = 0; i < req.files.length; i++) {
      let { Location } = await uploadS3(
        req.files[i],
        process.env.AWS_BUCKET_REGION,
        process.env.AWS_ACCESS_KEY,
        process.env.AWS_SECRET_KEY,
        process.env.AWS_BUCKET_NAME,
      );
      array.push(Location);
    }
    req.body.image = array;
  }
  const result = await Car.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!result)
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
    data: {
      result,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const result = await Car.findByIdAndDelete(req.params.id);
  if (!result)
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    data: null,
  });
});

exports.getMine = catchAsync(async (req, res, next) => {
  const [result, totalCount] = await filter(
    Car.find({ createdBy: req.user._id }),
    req.query,
  );

  if (result.length === 0)
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

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

exports.addtoFav = catchAsync(async (req, res, next) => {
  const result = await Car.findOne({ _id: req.params.id, favOf: req.user._id });
  if (result)
    return next(
      new AppError(ERRORS.INVALID.ALREADY_FAV, STATUS_CODE.BAD_REQUEST),
    );
  await Car.updateOne(
    { _id: req.params.id },
    { $push: { favOf: req.user._id } },
  );
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.ADDED_FAV,
  });
});

exports.removeFromFav = catchAsync(async (req, res, next) => {
  const result = await Car.findOne({ _id: req.params.id, favOf: req.user._id });
  if (!result) {
    return next(
      new AppError(ERRORS.INVALID.NOT_IN_FAV, STATUS_CODE.BAD_REQUEST),
    );
  }
  await Car.updateOne(
    { _id: req.params.id },
    { $pull: { favOf: req.user._id } },
  );
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.REMOVED_FAV,
  });
});

exports.favorites = catchAsync(async (req, res, next) => {
  const [result, totalCount] = await filter(
    Car.find({ favOf: req.user._id }),
    req.query,
  );

  if (result.length === 0)
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

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
