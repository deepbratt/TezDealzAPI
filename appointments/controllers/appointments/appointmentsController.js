const Appointments = require('../../models/appointmentsModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const { APIFeatures } = require('@utils/tdb_globalutils');

exports.createAppointment = catchAsync(async (req, res, next) => {
  if (req.user) {
    if (!req.user.phone) {
      return next(new AppError('Please enter phone number', STATUS_CODE.UNAUTHORIZED));
    }
    req.body.firstname = req.user.firstName;
    req.body.lastName = req.user.lastName;
    req.body.phone = req.user.phone;
  } else {
    const { firstName, lastName, phone } = req.body;
    if (!firstName || !lastName || !phone) {
      return next(
        new AppError('Please Provide a first name, last name or phone', STATUS_CODE.BAD_REQUEST),
      );
    }
  }

  if (req.user.role === 'User' && req.body.status) {
    return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
  }

  const result = await Appointments.create(req.body);

  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
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
  const features = new APIFeatures(Appointments.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .pagination();

  const result = await features.query;

  if (!result || result.length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
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
  const result = await Appointments.findById(req.params.id);

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

exports.updateAppointment = catchAsync(async (req, res, next) => {
  const result = await Appointments.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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

exports.deleteAppointment = catchAsync(async (req, res, next) => {
  const result = await Appointments.findByIdAndDelete(req.params.id);

  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE,
  });
});
