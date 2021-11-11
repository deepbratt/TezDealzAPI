const { APIFeatures } = require('@utils/tdb_globalutils');
//const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
//const { filter } = require('../../utils/apifilter');

exports.filter = async (query, queryParams) => {
	try{
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
}
	catch(e){
		logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
	}
};
