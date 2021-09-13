const Ticket = require('../../models/ticket/ticketModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const { filter } = require('../factory/factoryHandler');

exports.createTechAssistance = catchAsync(async (req, res, next) => {
	if (req.user) {
		req.body.email = req.user.email;
		req.body.phone = req.user.phone;
		req.body.user_id = req.user._id;
	} else {
		const { email, phone } = req.body;
		if (!email || !phone) {
			return next(new AppError('Email & Phone  required', STATUS_CODE.BAD_REQUEST));
		}
	}
	if (!req.body.description) {
		return next(new AppError('Description  required', STATUS_CODE.BAD_REQUEST));
	}
	req.body.type = 'Technical Assistance';
	const result = await Ticket.create(req.body);
	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

	res.status(STATUS_CODE.CREATED).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		data: {
			result,
		},
	});
});

exports.createAdvAssistance = catchAsync(async (req, res, next) => {
	req.body.email = req.user.email;
	req.body.phone = req.user.phone;
	req.body.user_id = req.user._id;
	req.body.type = 'Advertisement Assistance';
	const result = await Ticket.create(req.body);
	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

	res.status(STATUS_CODE.CREATED).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		data: {
			result,
		},
	});
});

exports.getAll = catchAsync(async (req, res, next) => {
	const [result, totalCount] = await filter(Ticket.find(), req.query);

	if (result.length <= 0) {
		return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
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
	const result = await Ticket.findById(req.params.id);
	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		data: {
			result,
		},
	});
});

exports.deleteOne = catchAsync(async (req, res, next) => {
	const result = await Ticket.findByIdAndDelete(req.params.id);
	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		data: null,
	});
});

exports.updateOne = catchAsync(async (req, res, next) => {
	const result = await Ticket.updateOne({ _id: req.params.id }, req.body);
	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
		data: {
			result,
		},
	});
});
