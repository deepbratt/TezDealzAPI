const Validator = require('email-validator');
const Users = require('../../model/userModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS } = require('@constants/tdb-constants');
const { regex } = require('../../utils/regex');

exports.signupByAdmin = catchAsync(async (req, res, next) => {
	if (!req.body.data) {
		return next(
			new AppError(
				`${ERRORS.REQUIRED.EMAIL_REQUIRED} / ${ERRORS.REQUIRED.PHONE_REQUIRED}`,
				STATUS_CODE.UNAUTHORIZED
			)
		);
	}
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
			signedUpWithEmail: true,
		});
	} else if (regex.phone.test(req.body.data)) {
		user = await Users.create({
			firstName: req.body.firstName.trim(),
			lastName: req.body.lastName.trim(),
			phone: req.body.data,
			username: req.body.username,
			role: req.body.role,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm,
			signedUpWithPhone:true

		});
	} else {
		return next(
			new AppError(
				`${ERRORS.INVALID.INVALID_EMAIL} / ${ERRORS.INVALID.INVALID_PHONE}`,
				STATUS_CODE.BAD_REQUEST
			)
		);
	}

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
	const result = await Users.findOne({ _id: req.params.id, banned: true });
	if (!result) {
		return next(
			new AppError('User is already Unban or Does not Exist', STATUS_CODE.BAD_REQUEST)
		);
	}
	await Users.updateOne({ _id: req.params.id }, { banned: false });
	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: 'You have Unbanned User successfully.',
	});
});

exports.banUser = catchAsync(async (req, res, next) => {
	const result = await Users.findOne({ _id: req.params.id, banned: false });
	if (!result) {
		return next(
			new AppError('This User is already banned or Does not exist', STATUS_CODE.BAD_REQUEST)
		);
	}
	await Users.updateOne({ _id: req.params.id }, { banned: true });
	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: 'You have successfully Banned this User',
	});
});
