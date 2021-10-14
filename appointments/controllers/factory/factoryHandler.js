const { APIFeatures } = require('@utils/tdb_globalutils');

exports.filter = async (query, queryParams) => {
  const results = new APIFeatures(query, queryParams).filter().search().sort().limitFields();
  const totalCount = await results.query.countDocuments();

  const freatures = new APIFeatures(query, queryParams)
    .filter()
    .search()
    .sort()
    .limitFields()
    .pagination();
  const doc = await freatures.query;

  return [doc, totalCount];
};
