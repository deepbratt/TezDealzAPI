const { APIFeatures, catchAsync } = require('@utils/tdb_globalutils');

exports.filter = async (query, queryParams) => {
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
};

exports.filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
