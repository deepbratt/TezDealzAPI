const Features = require('../../models/cars/features/featuresModel');
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




exports.createFeature = catchAsync(async (req, res, next) => {
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

		const result = await Features.create(req.body);

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

exports.getAllFeatures = catchAsync(async (req, res, next) => {
	try {
		const [result, totalCount] = await filter(Features.find(), req.query);

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
		countOnpage: result.length,
		data: {
			result,
		},
	});
});

exports.getOneFeature = catchAsync(async (req, res, next) => {
	try {
		const result = await Features.findById(req.params.id);

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

exports.UpdateOneFeature = catchAsync(async (req, res, next) => {
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
		const result = await Features.findByIdAndUpdate(req.params.id, req.body, {
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
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		data: {
			result,
		},
	});
});

exports.deleteFeature = catchAsync(async (req, res, next) => {
	try {
		const result = await Features.findByIdAndDelete(req.params.id);

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
