const { APIFeatures, catchAsync } = require('@utils/tdb_globalutils');

exports.filter = async (query, queryParams) => {
  try{
  const results = new APIFeatures(query, queryParams).filter().search();
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

exports.filterObj = (obj, ...allowedFields) => {
  try{
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}
catch(e){
  logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
}
};
