const Ads = require('../../models/cars/carModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');

exports.getAllOwners = catchAsync(async (req, res, next) => {
  const stats = await Ads.aggregate([
    {
      $group: {
        // _id: { $toUpper: '$model' },
        _id: '$createdBy',
        total: { $sum: 1 },
        ownersId: { $push: '$createdBy' },
      },
    },
    {
      $project: { _id: 1, total: 1, ownersId: 1 },
    },
    {
      $sort: { total: 1 },
    },
  ]);

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      stats,
    },
  });
});
