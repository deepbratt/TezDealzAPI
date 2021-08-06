const Car = require('../models/carModel');
const { AppError, catchAsync, uploadS3, APIFeatures } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS, STATUS_CODE, SUCCESS_MSG } = require('@constants/tdb-constants');

exports.createOne = catchAsync(async (req, res, next) => {
	if (req.files) {
		let array = [];
		for (var i = 0; i < req.files.length; i++) {
			let { Location } = await uploadS3(
				req.files[i],
				process.env.AWS_BUCKET_REGION,
				process.env.AWS_ACCESS_KEY,
				process.env.AWS_SECRET_KEY,
				process.env.AWS_BUCKET_NAME
			);
			array.push(Location);
		}
		req.body.images = array;
	}
	req.body.createdBy = req.user._id;
	const result = await Car.create(req.body);
	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
	res.status(STATUS_CODE.CREATED).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
	});
});

exports.getAll = catchAsync(async (req, res, next) => {
	const freatures = new APIFeatures(Car.find(), req.query)
		.filter()
		.search()
		.sort()
		.limitFields()
		.pagination();
	const result = await freatures.query;
	if (result.length === 0)
		return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		results: result.length,
		data: {
			result,
		},
	});
});

exports.getOne = catchAsync(async (req, res, next) => {
	const result = await Car.findById(req.params.id).populate('createdBy');

	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		data: {
			result,
		},
	});
});

exports.updateOne = catchAsync(async (req, res, next) => {
	if (req.files) {
		let array = [];
		for (var i = 0; i < req.files.length; i++) {
			let { Location } = await uploadS3(
				req.files[i],
				process.env.AWS_BUCKET_REGION,
				process.env.AWS_ACCESS_KEY,
				process.env.AWS_SECRET_KEY,
				process.env.AWS_BUCKET_NAME
			);
			array.push(Location);
		}
		req.body.images = array;
	}
	const result = await Car.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});

	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
		data: {
			result,
		},
	});
});

exports.deleteOne = catchAsync(async (req, res, next) => {
	const result = await Car.findByIdAndDelete(req.params.id);
	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		data: null,
	});
});

exports.getMine = catchAsync(async (req, res, next) => {
	const freatures = new APIFeatures(Car.find({ createdBy: req.user._id }), req.query)
		.filter()
		.sort()
		.limitFields()
		.pagination();
	const result = await freatures.query;
	if (!result) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		results: result.length,
		data: {
			result,
		},
	});
});

exports.addtoFav = catchAsync(async (req, res, next) => {
	const result = await Car.findOne({ _id: req.params.id, favOf: req.user._id });
	if (result) return next(new AppError('Already in favourites', STATUS_CODE.BAD_REQUEST));
	await Car.updateOne({ _id: req.params.id }, { $push: { favOf: req.user._id } });
	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: 'Added to Favorites',
	});
});

exports.removeFromFav = catchAsync(async (req, res, next) => {
	const result = await Car.findOne({ _id: req.params.id, favOf: req.user._id });
	if (!result) {
		return next(new AppError('You have not added to favourites yet', STATUS_CODE.BAD_REQUEST));
	}
	await Car.updateOne({ _id: req.params.id }, { $pull: { favOf: req.user._id } });
	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: 'Removed from Favorites',
	});
});

exports.favorites = catchAsync(async (req, res, next) => {
	const freatures = new APIFeatures(Car.find({ favOf: req.user._id }), req.query)
		.filter()
		.sort()
		.limitFields()
		.pagination();

	const result = await freatures.query;

	if (result.length === 0) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

	res.status(STATUS_CODE.OK).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		results: result.length,
		data: {
			result,
		},
	});
});
