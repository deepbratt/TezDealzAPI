const Users = require('../../model/userModel');
const moment = require('moment');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS } = require('@constants/tdb-constants');
const Validator = require('email-validator');

exports.signupByAdmin = catchAsync(async (req, res, next) => {
  let user;
  if (Validator.validate(req.body.data)) {
    user = await Users.create({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      email: req.body.data,
      role: req.body.role,
      username: req.body.username,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
  } else {
    user = await Users.create({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      phone: req.body.data,
      username: req.body.username,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
  }

  if (!req.body.data) {
    return next(
      new AppError(
        `${ERRORS.REQUIRED.EMAIL_REQUIRED} / ${ERRORS.REQUIRED.PHONE_REQUIRED}`,
        STATUS_CODE.UNAUTHORIZED,
      ),
    );
  }

  if (Validator.validate(req.body.data)) {
    user.signedUpWithEmail = true;
  } else {
    user.signedUpWithPhone = true;
  }
  await user.save();

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
  });
});

exports.inactiveUser = catchAsync(async (req, res, next) => {
  const result = await Users.findOne({ _id: req.params.id, active: true });
  if (!result) {
    return next(new AppError(ERRORS.INVALID.INACTIVE_USER, STATUS_CODE.BAD_REQUEST));
  }
  await Users.updateOne({ _id: req.params.id }, { active: false });
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.USER_INACTIVATED,
  });
});

// Active User By Admin or Moderator
exports.activeUser = catchAsync(async (req, res, next) => {
  const result = await Users.findOne({ _id: req.params.id, active: false });
  if (!result) {
    return next(new AppError(ERRORS.INVALID.ACTIVE_USER, STATUS_CODE.BAD_REQUEST));
  }
  await Users.updateOne({ _id: req.params.id }, { active: true });
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.USER_ACTIVATED,
  });
});

exports.unbanUser = catchAsync(async (req, res, next) => {
  const result = await Users.findOne({ _id: req.params.id, ban: true });
  if (!result) {
    return next(new AppError('User is already Unban or Does not Exist', STATUS_CODE.BAD_REQUEST));
  }
  await Users.updateOne({ _id: req.params.id }, { ban: false });
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: 'You have Unbanned User successfully.',
  });
});

exports.banUser = catchAsync(async (req, res, next) => {
  const result = await Users.findOne({ _id: req.params.id, ban: false });
  if (!result) {
    return next(
      new AppError('This User is already banned or Does not exist', STATUS_CODE.BAD_REQUEST),
    );
  }
  await Users.updateOne({ _id: req.params.id }, { ban: true });
  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: 'You have successfully Banned this User',
  });
});

// User Statistics
exports.userStats = catchAsync(async (req, res, next) => {
  const stats = await Users.aggregate([
    {
      $group: {
        _id: { $toUpper: '$role' },
        // _id: null,
        numUser: { $sum: 1 },
        roles: { $push: '$role' },
      },
    },
    {
      $project: { _id: 1, numUser: 1, roles: 1 },
    },
    {
      $sort: { numUser: 1 },
    },
  ]);

  if (!stats) {
    return next(new AppError('Error in Stats'));
  }

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
  const stats = await Users.aggregate([
    {
      $match: {
        createdAt: { $lte: moment(max).toDate(), $gte: moment(min).toDate() },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        userCreated: { $sum: 1 },
        userName: { $push: '$username' },
        userEmail: { $push: '$email' },
        userPhone: { $push: '$phone' },
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
        userName: 1,
        userEmail: 1,
        userPhone: 1,
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
