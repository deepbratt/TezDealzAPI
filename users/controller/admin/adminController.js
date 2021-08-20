const Users = require('../../model/userModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS } = require('@constants/tdb-constants');

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
