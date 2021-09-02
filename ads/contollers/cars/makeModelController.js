const CarMake = require('../../models/cars/make-model/car_make');
const CarModel = require('../../models/cars/make-model/car_model_version');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const { filter } = require('../factory/factoryHandler');

exports.getAllMakes = catchAsync(async (req, res, next) => {
	const [result, totalCount] = await filter(CarMake.find(), req.query);

	if (result.length <= 0) {
		return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
	}

	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		total: totalCount,
		data: {
			result,
		},
	});
});
exports.getModels = catchAsync(async (req, res, next) => {
	const [result, totalCount] = await filter(CarModel.find().select('-versions'), req.query);

	if (result.length <= 0) {
		return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
	}

	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		total: totalCount,
		data: {
			result,
		},
	});
});

exports.getVersions = catchAsync(async (req, res, next) => {
	const [result, totalCount] = await filter(CarModel.find(), req.query);
	if (result[0].versions.length <= 0) {
		return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
	}

	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		total: result[0].versions.length,
		data: {
			result: result[0].versions,
		},
	});
});

// exports.createMakeModel = catchAsync(async (req, res, next) => {
// 	await CarMakeModel.create(req.body);

// 	res.status(STATUS_CODE.CREATED).json({
// 		status: STATUS.SUCCESS,
// 		message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
// 	});
// });
// exports.updateMakeModel = catchAsync(async (req, res, next) => {
// 	const result = await CarMakeModel.findByIdAndUpdate(req.params.id, req.body, {
// 		new: true,
// 		runValidators: true,
// 	});

// 	if (!result) {
// 		return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
// 	}

// 	if (req.body.model) {
// 		return next(new AppError(ERRORS.INVALID.MODEL_UPDATE, STATUS_CODE.BAD_REQUEST));
// 	}
// 	res.status(STATUS_CODE.OK).json({
// 		status: STATUS.SUCCESS,
// 		message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
// 		data: {
// 			result,
// 		},
// 	});
// });

// exports.deleteMakeModel = catchAsync(async (req, res, next) => {
// 	const result = await CarMakeModel.findByIdAndDelete(req.params.id);

// 	if (!result) {
// 		return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
// 	}

// 	res.status(STATUS_CODE.OK).json({
// 		status: STATUS.SUCCESS,
// 		message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE,
// 	});
// });

// exports.getAllModels = catchAsync(async (req, res, next) => {
// 	const [result, totalCount] = await filter(CarMakeModel.find({ make: req.params.make }), req.query);

// 	if (!result) {
// 		return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
// 	}

// 	res.status(STATUS_CODE.OK).json({
// 		status: STATUS.SUCCESS,
// 		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
// 		total: totalCount,
// 		data: {
// 			result,
// 		},
// 	});
// });

// exports.addToModel = catchAsync(async (req, res, next) => {
// 	let result;
// 	result = await CarMakeModel.findOne({ _id: req.params.id });
// 	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

// 	if (req.body.make) {
// 		return next(new AppError(ERRORS.INVALID.MAKE_UPDATE, STATUS_CODE.BAD_REQUEST));
// 	}
// 	const newValue = await CarMakeModel.updateOne(
// 		{ _id: req.params.id },
// 		{ $push: { model: req.body.model } }
// 	);
// 	res.status(STATUS_CODE.OK).json({
// 		status: STATUS.SUCCESS,
// 		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
// 		data: {
// 			newValue,
// 		},
// 	});
// });

// exports.removeFromModel = catchAsync(async (req, res, next) => {
// 	let result;
// 	result = await CarMakeModel.findOne({ _id: req.params.id });
// 	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

// 	if (req.body.make) {
// 		return next(new AppError(ERRORS.INVALID.MAKE_REMOVE, STATUS_CODE.BAD_REQUEST));
// 	}
// 	const newValue = await CarMakeModel.updateOne(
// 		{ _id: req.params.id },
// 		{ $pull: { model: req.body.model } }
// 	);

// 	res.status(STATUS_CODE.OK).json({
// 		status: STATUS.SUCCESS,
// 		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
// 		data: {
// 			newValue,
// 		},
// 	});
// });
