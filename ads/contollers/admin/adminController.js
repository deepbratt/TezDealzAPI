const Ads = require('../../models/cars/carModel');
const moment = require('moment');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');

exports.totalOwners = catchAsync(async (req, res, next) => {
  const result = await Ads.aggregate([
    {
      $group: {
        _id: '$createdBy',
      },
    },
    {
      $project: { _id: 0, totalOwners: 0 },
    },
    {
      $count: 'totalOwners',
    },

    // {
    //   $facet: {
    //     Owners: [{ $count: 'total' }],
    //   },
    // },
  ]);

  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});

exports.totalCars = catchAsync(async (req, res, next) => {
  const result = await Ads.aggregate([
    {
      $group: {
        _id: '$_id',
      },
    },
    {
      $project: { _id: 0, totalOwners: 0 },
    },
    {
      $count: 'totalCars',
    },
  ]);

  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});

exports.carsMonthlyStats = catchAsync(async (req, res, next) => {
  const result = await Ads.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $year: '$createdAt' }, { $year: new Date() }],
          $eq: [{ $month: '$createdAt' }, { $month: new Date() }],
        },
      },
    },
    {
      $group: {
        _id: '$createdAt',
        carCreated: { $sum: 1 },
      },
    },
    {
      $count: 'carsAddedThisMonth',
    },
    // {
    //   $facet: { metadat: [{ $count: 'Total' }] },
    // },
  ]);

  if (result <= 0) return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));

  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});
