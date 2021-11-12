const BodyType = require('../../models/cars/bodyTypes/bodyTypes');
const { AppError, catchAsync, uploadS3 } = require('@utils/tdb_globalutils');
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

exports.createBodyType = catchAsync(async (req, res, next) => {
	try {
		if (req.file) {
			let { Location } = await uploadS3(
				req.file,
				process.env.AWS_BUCKET_REGION,
				process.env.AWS_ACCESS_KEY,
				process.env.AWS_SECRET_KEY,
				process.env.AWS_BUCKET_NAME
			);
			req.body.image = Location;
		}

		const result = await BodyType.create(req.body);

		if (!result) {
			logger.error("Custom Error Message");
			return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
		}
	} catch (e) {
		logger.error("Custom Error Message")
		logger.trace("Something unexpected has occured.", e)
	}

	res.status(STATUS_CODE.CREATED).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		data: {
			result,
		},
	});
});

exports.getAllBodyTypes = catchAsync(async (req, res, next) => {
	try {
		const [result, totalCount] = await filter(BodyType.find(), req.query);

		if (result.length <= 0) {
			logger.error("Custom error message")
			return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
		}
	} catch (e) {
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

exports.getOneBodyType = catchAsync(async (req, res, next) => {
	try {
		const result = await BodyType.findById(req.params.id);

		if (!result) {
			logger.error("Custom error message")
			return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
		}
	} catch (e) {
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

exports.updateBodyType = catchAsync(async (req, res, next) => {
	try {
		if (req.file) {
			let { Location } = await uploadS3(
				req.file,
				process.env.AWS_BUCKET_REGION,
				process.env.AWS_ACCESS_KEY,
				process.env.AWS_SECRET_KEY,
				process.env.AWS_BUCKET_NAME
			);
			req.body.image = Location;
		}

		const result = await BodyType.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!result) {
			logger.error("Custom error message")
			return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
		}
	} catch (e) {
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

exports.deleteBodyType = catchAsync(async (req, res, next) => {
	try {
		const result = await BodyType.findByIdAndDelete(req.params.id);

		if (!result) {
			logger.error("Custom error message")
			return new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND);
		}
	} catch (e) {
		logger.error("Custom Error Message")
		logger.trace("Something unexpected has occured.", e)
	}

	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE,
	});
});
