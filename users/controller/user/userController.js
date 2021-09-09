const Users = require('../../model/userModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS } = require('@constants/tdb-constants');
const { uploadS3 } = require('@utils/tdb_globalutils');
const { filterObj } = require('../factory/factoryHandler');

// To filter unwanted fields from req.body
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user tying to change/update passowrd data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(ERRORS.INVALID.INVALID_ROUTE, STATUS_CODE.BAD_REQUEST));
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
  if (req.user.signedUpWithEmail) {
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
  } else if (req.user.signedUpWithPhone) {
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

  // Update User document
  const user = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
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

// User can also delete/inactive himself
exports.deleteMe = catchAsync(async (req, res, next) => {
  await Users.findByIdAndUpdate(req.user.id, { active: false });

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.USER_DELETED,
  });
});
