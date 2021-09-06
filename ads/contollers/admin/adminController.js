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
        _id: '$createdAt',
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

  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});
