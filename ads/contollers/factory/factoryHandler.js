const moment = require('moment');
const { APIFeatures, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const { filter } = require('../../utils/apifilter');

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


exports.filter = async (query, queryParams) => {
try{
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
}
  catch(e){
    logger.error("Custom Error Message")
		logger.trace("Something unexpected has occured.", e)
  }

};

exports.stats = (Model) => {
  return catchAsync(async (req, res, next) => {
   
   try{
    const stats = await Model.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
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
  }
catch(e){
  logger.error("Custom Error Message")
  logger.trace("Something unexpected has occured.", e)
}

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
    try{
    const { min, max } = req.params;
    const stats = await Model.aggregate([
      {
        $match: {
          createdAt: { $lte: moment(max).toDate(), $gte: moment(min).toDate() },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
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
  }
  catch(e){
    logger.error("Custom Error Message")
		logger.trace("Something unexpected has occured.", e)
  }

    res.status(200).json({
      status: STATUS.SUCCESS,
      data: stats,
    });
  });
};

exports.citiesByProvince = (Model) => {
  return catchAsync(async (req, res, next) => {
    try{
    let array = [
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          city: '$_id',
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    if (req.query.province) {
      array.unshift({ $match: filter(req.query) });
    }
    const result = await Model.aggregate(array);
  }
  catch(e){
    logger.error("Custom Error Message")
		logger.trace("Something unexpected has occured.", e)
  }

    res.status(200).json({
      status: STATUS.SUCCESS,
      data: {
        result,
      },
    });
  });
};
