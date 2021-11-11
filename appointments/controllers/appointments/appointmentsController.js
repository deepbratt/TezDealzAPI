const Appointments = require('../../models/appointmentsModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const { APIFeatures } = require('@utils/tdb_globalutils');

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
var logger = log4js.getLogger("Appointments");

exports.createAppointment = catchAsync(async (req, res, next) => {
  try {
    if (req.user) {
      if (!req.user.phone) {
        logger.error("Custom Error Message")
        return next(
          new AppError('Please enter phone number in your profile', STATUS_CODE.UNAUTHORIZED),
        );
      }

      req.body.firstName = req.user.firstName;
      req.body.lastName = req.user.lastName;
      req.body.phone = req.user.phone;
      req.body.user_id = req.user._id;

      if (req.user.role === 'User' && req.body.status) {
        logger.error("Custom Error Message")
        return next(new AppError('You are not allowed to add status', STATUS_CODE.UNAUTHORIZED));
      }
    } else {
      const { firstName, lastName, phone } = req.body;
      if (!firstName || !lastName || !phone) {
        logger.error("Custom Error Message")
        return next(
          new AppError('Please Provide a first name, last name or phone', STATUS_CODE.BAD_REQUEST),
        );
      }
      if (req.body.status) {
        logger.error("Custom Error Message")
        return next(new AppError('You are not allowed to add status', STATUS_CODE.UNAUTHORIZED));
      }
    }

    const result = await Appointments.create(req.body);

    if (!result) {
      logger.error("Custom Error Message")
      return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
  }
  catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
  }
  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    data: {
      result,
    },
  });
});

exports.getAllAppointments = catchAsync(async (req, res, next) => {
  try {
    const features = new APIFeatures(Appointments.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const result = await features.query;

    if (!result || result.length <= 0) {
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
    totalCount: result.length,
    data: {
      result,
    },
  });
});

exports.getOneAppointment = catchAsync(async (req, res, next) => {
  try {
    const result = await Appointments.findById(req.params.id);

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

exports.updateAppointment = catchAsync(async (req, res, next) => {
  try {
    const result = await Appointments.findByIdAndUpdate(req.params.id, req.body, {
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

exports.deleteAppointment = catchAsync(async (req, res, next) => {
  try {
    const result = await Appointments.findByIdAndDelete(req.params.id);

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

exports.getMine = catchAsync(async (req, res, next) => {
  try {
    const features = new APIFeatures(Appointments.find({ user_id: req.user._id }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .pagination();

    const result = await features.query;

    if (result.length === 0) {
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
    total: result.length,
    data: {
      result,
    },
  });
});

exports.cancelAppointment = catchAsync(async (req, res, next) => {
  try {
    const result = await Appointments.findOne({ _id: req.params.id, cancelled: false });
    if (!result) {
      logger.error("Custom Error Message")
      return next(
        new AppError('Appointment is already cancelled or does not exists.', STATUS_CODE.BAD_REQUEST),
      );
    }
    await Appointments.updateOne({ _id: req.params.id }, { cancelled: true });
  }
  catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
  }


  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: 'Your Appointment is cancelled successfully',
  });
});

exports.reOpenAppointment = catchAsync(async (req, res, next) => {
  try {
    const result = await Appointments.findOne({ _id: req.params.id, cancelled: true });
    if (!result) {
      logger.error("Custom Error Message")
      return next(
        new AppError('Appointment is already re-opened or does not exists.', STATUS_CODE.BAD_REQUEST),
      );
    }
    await Appointments.updateOne({ _id: req.params.id }, { cancelled: false });
  }
  catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: 'Your Appointment is re-opened successfully',
  });
});
