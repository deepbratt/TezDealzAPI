const moment= require('moment')
const { APIFeatures, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');

exports.filter = async (query, queryParams) => {
	const results = new APIFeatures(query, queryParams).filter().search().sort().limitFields();
	const totalCount = await results.query.count();

	const freatures = new APIFeatures(query, queryParams)
		.filter()
		.search()
		.sort()
		.limitFields()
		.pagination();
	const doc = await freatures.query;

	return [doc, totalCount];
};

exports.stats = (Model) => {
	return catchAsync(async (req, res, next) => {
		const stats = await Model.aggregate([
			{
				$group: {
					_id: null,
					numCars: { $sum: 1 },
					avgPrice: { $avg: '$price' },
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' },
				},
			},
			{
				$project: { _id: 0 },
			},
			{
				$sort: { avgPrice: 1 },
			},
		]);
		res.status(200).json({
			status: STATUS.SUCCESS,
			data: {
				stats,
			},
		});
	});
};

exports.dailyAggregate = (Model) => {
	return catchAsync(async (req, res, next) => {
		const { min, max } = req.params;
		const stats = await Model.aggregate([
			{
				$match: {
					createdAt: {
						$lte: { $regex: `^${moment(max).toDate()}$`, $options: 'm' },
						$gte: { $regex: `^${moment(min).toDate()}$`, $options: 'm' },
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
					cars: { $sum: 1 },
				},
			},
			{
				$addFields: {
					date: '$_id',
				},
			},
			{
				$project: {
					_id: 0,
				},
			},
			{
				$sort: {
					date: 1,
				},
			},
		]);
		res.status(200).json({
			status: STATUS.SUCCESS,
			data: {
				stats,
			},
		});
	});
};
