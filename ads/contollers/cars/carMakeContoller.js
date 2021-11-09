const CarMake = require('../../models/cars/make-model/car_make');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const { filter } = require('../factory/factoryHandler');

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
var logger = log4js.getLogger("Ads");


exports.createMake = catchAsync(async (req, res, next) => {
	try {
		const result = await CarMake.create(req.body);
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
		message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
		data: {
			result,
		},
	});
});

exports.getAllMakes = catchAsync(async (req, res, next) => {
	try {
		const [result, totalCount] = await filter(CarMake.find(), req.query);

		if (result.length <= 0) {
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
		countOnPage: result.length,
		totalCount: totalCount,
		data: {
			result,
		},
	});
});

exports.getOneMake = catchAsync(async (req, res, next) => {
	try {
		const result = await CarMake.findById(req.params.id);

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

exports.updateMake = catchAsync(async (req, res, next) => {
	try {
		const result = await CarMake.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (req.body.make_id) {
			logger.error("Custom Error Message")
			return next(new AppError(ERRORS.INVALID.MAKE_ID_UPDATE, STATUS_CODE.BAD_REQUEST));
		}

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

exports.deleteMake = catchAsync(async (req, res, next) => {
	try {
		const result = await CarMake.findByIdAndDelete(req.params.id);

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
