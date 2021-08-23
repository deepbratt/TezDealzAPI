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
					_id: { $toUpper: '$city' },
					numCars: { $sum: 1 },
					avgPrice: { $avg: '$price' },
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' },
				},
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
