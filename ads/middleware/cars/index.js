const Car = require('../../models/cars/carModel');
const { AppError, catchAsync, uploadS3, APIFeatures } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS, STATUS_CODE, SUCCESS_MSG } = require('@constants/tdb-constants');

exports.permessionCheck = catchAsync(async (req, res, next) => {
	const currentUserId = req.user._id;
	const result = await Car.findById(req.params.id);
	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
	if (!currentUserId.equals(result.createdBy) && req.user.role === 'User') {
		return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
	}
	next();
});

exports.favPermessionCheck = catchAsync(async (req, res, next) => {
	const currentUserId = req.user._id;
	const result = await Car.findById(req.params.id);
	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
	if (currentUserId.equals(result.createdBy)) {
		return next(new AppError(ERRORS.INVALID.CANT_ADD_FAV, STATUS_CODE.BAD_REQUEST));
	}
	next();
});

exports.phoneCheck = catchAsync(async (req, res, next) => {
	if (!req.user.phone) {
		return next(
			new AppError('Please Add Your Phone Number First To Proceed Next', STATUS_CODE.UNAUTHORIZED)
		);
	}
	next();
});
