const CarVersion = require('../../models/cars/make-model/car_version');
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

// VERSIONS //////////////////////////////////
exports.getVersions = catchAsync(async (req, res, next) => {
	try {
		const [result, totalCount] = await filter(CarVersion.find(), req.query);
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
		totalCount: totalCount,
		countOnPage: result.length,
		data: {
			result,
		},
	});
});

exports.addVersion = catchAsync(async (req, res, next) => {
	try {
		const result = await CarVersion.create(req.body);
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

exports.updateVersion = catchAsync(async (req, res, next) => {
	try {
		const result = await CarVersion.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

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

exports.removeVersion = catchAsync(async (req, res, next) => {
	try {
		const result = await CarVersion.findById(req.params.id);
		if (!result) {
			logger.error("Custom Error Message")
			return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
		}
		await CarVersion.findByIdAndDelete(req.params.id);
	}
	catch (e) {
		logger.error("Custom Error Message")
		logger.trace("Something unexpected has occured.", e)
	}

	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		data: null,
	});
});
