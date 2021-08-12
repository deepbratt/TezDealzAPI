const { AppError, catchAsync, uploadS3, APIFeatures } = require('@utils/tdb_globalutils');

exports.filter = async (query, queryParams) => {
	const freatures = new APIFeatures(query, queryParams).filter().sort().limitFields().pagination();
	const results = new APIFeatures(query, queryParams).filter().sort().limitFields();
	const doc = await freatures.query;
	const totalCount = await results.query.count();
	return [doc, totalCount];
};
