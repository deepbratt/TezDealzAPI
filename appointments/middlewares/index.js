const Appointments = require('../models/appointmentsModel');
const { AppError, catchAsync, uploadS3, APIFeatures } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS, STATUS_CODE, SUCCESS_MSG } = require('@constants/tdb-constants');

exports.permessionCheck = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;
  const result = await Appointments.findById(req.params.id);
  if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  if (!currentUserId.equals(result.user_id) && req.user.role === 'User') {
    return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
  }
  next();
});
