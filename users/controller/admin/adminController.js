const Validator = require('email-validator');
const User = require('../../model/userModel');
const moment = require('moment');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS } = require('@constants/tdb-constants');
const { regex } = require('../../utils/regex');
const { send } = require('../../utils/rabbitMQ');
const { filterObj, filter } = require('../factory/factoryHandler');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let result;
  if (req.user.role === 'Admin') {
    result = await filter(User.find(), req.query);
  } else {
    result = await filter(User.find({ role: 'User' }), req.query);
  }
  if (result[0].length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    countOnPage: result[0].length,
    totalCount: result[1],
    data: {
      result: result[0],
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const result = await User.findById(req.params.id);
  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
  if (req.user.role !== 'Admin' && result.role !== 'User') {
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

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const result = await User.findById(req.params.id);
  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
  if (req.user.role !== 'Admin' && result.role !== 'User') {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
  // Image Upload
  if (req.file) {
    let { Location } = await uploadS3(
      req.file,
      process.env.AWS_BUCKET_REGION,
      process.env.AWS_ACCESS_KEY,
      process.env.AWS_SECRET_KEY,
      process.env.AWS_BUCKET_NAME,
    );
    req.body.image = Location;
  }

  // filter out fileds that cannot be updated e.g Role etc
  let filteredBody;
  if (result.signedUpWithEmail) {
    filteredBody = filterObj(
      req.body,
      'firstName',
      'lastName',
      'phone',
      'image',
      'gender',
      'country',
      'city',
      'dateOfBirth',
    );
  } else if (result.signedUpWithPhone) {
    filteredBody = filterObj(
      req.body,
      'firstName',
      'lastName',
      'email',
      'image',
      'gender',
      'country',
      'city',
      'dateOfBirth',
    );
  }
  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    runValidators: true,
    new: true,
  });

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
    result: {
      user,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.PASSWORD_CHANGED,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const result = await User.findById(req.params.id);
  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
  if (req.user.role !== 'Admin' && result.role !== 'User') {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.USER_DELETED,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  let user;
  if (req.user.role !== 'Admin' && req.body.role !== 'User') {
    return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
  }
  if (Validator.validate(req.body.data)) {
    user = await User.create({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      email: req.body.data,
      role: req.body.role,
      username: req.body.username,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      signedUpWithEmail: true,
    });
  } else if (regex.phone.test(req.body.data)) {
    user = await User.create({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      phone: req.body.data,
      username: req.body.username,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      signedUpWithPhone: true,
    });
  } else {
    return next(
      new AppError(
        `${ERRORS.INVALID.INVALID_EMAIL} / ${ERRORS.INVALID.INVALID_PHONE}`,
        STATUS_CODE.BAD_REQUEST,
      ),
    );
  }
  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
  });
});

exports.inactiveUser = catchAsync(async (req, res, next) => {
  const result = await User.findOne({ _id: req.params.id, active: true });
  if (!result) {
    return next(new AppError(ERRORS.INVALID.INACTIVE_USER, STATUS_CODE.BAD_REQUEST));
  }
  if (req.user.role !== 'Admin' && result.role !== 'User') {
    return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
  }
  await User.updateOne({ _id: req.params.id }, { active: false });
  send('inactive_user', JSON.stringify({ createdBy: req.params.id }));
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.USER_INACTIVATED,
  });
});

// Active User By Admin or Moderator
exports.activeUser = catchAsync(async (req, res, next) => {
  const result = await User.findOne({ _id: req.params.id, active: false });
  if (!result) {
    return next(new AppError(ERRORS.INVALID.ACTIVE_USER, STATUS_CODE.BAD_REQUEST));
  }
  if (req.user.role !== 'Admin' && result.role !== 'User') {
    return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
  }
  await User.updateOne({ _id: req.params.id }, { active: true });
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.USER_ACTIVATED,
  });
});

exports.unbanUser = catchAsync(async (req, res, next) => {
  const result = await User.findOne({ _id: req.params.id, ban: true });
  if (!result) {
    return next(new AppError(ERRORS.INVALID.UNBAN_USER, STATUS_CODE.BAD_REQUEST));
  }
  if (req.user.role !== 'Admin' && result.role !== 'User') {
    return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
  }
  await User.updateOne({ _id: req.params.id }, { ban: false });
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.UNBANNED_USER,
  });
});

exports.banUser = catchAsync(async (req, res, next) => {
  const result = await User.findOne({ _id: req.params.id, ban: false });
  if (!result) {
    return next(new AppError(ERRORS.INVALID.BAN_USER, STATUS_CODE.BAD_REQUEST));
  }
  if (req.user.role !== 'Admin' && result.role !== 'User') {
    return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
  }
  await User.updateOne({ _id: req.params.id }, { ban: true });
  send('inactive_user', JSON.stringify({ createdBy: req.params.id }));
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.BANNED_USER,
  });
});

// User Statistics
exports.userStats = catchAsync(async (req, res, next) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: { $toUpper: '$role' },
        // _id: null,
        total: { $sum: 1 },
        Roles: { $push: '$role' },
      },
    },
    {
      $project: { _id: 1, total: 1 },
    },
    {
      $sort: { total: 1 },
    },
  ]);

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      stats,
    },
  });
});

// Stats of Users from one date to another
exports.dailyUserAggregate = catchAsync(async (req, res, next) => {
  const { min, max } = req.params;
  const stats = await User.aggregate([
    {
      $match: {
        createdAt: { $lte: moment(max).toDate(), $gte: moment(min).toDate() },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        userCreated: { $sum: 1 },
      },
    },
    {
      $addFields: {
        date: '$_id',
      },
    },
    {
      $project: {
        _id: 1,
        userCreated: 1,
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
    // {
    //   $limit: 10,
    // },
  ]);
  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      stats,
    },
  });
});
