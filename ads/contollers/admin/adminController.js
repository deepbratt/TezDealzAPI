const Ads = require('../../models/cars/carModel');
const moment = require('moment');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');

exports.totalOwners = catchAsync(async (req, res, next) => {
  const result = await Ads.aggregate([
    {
      $group: {
        _id: '$createdBy',
        totalOwners: { $sum: 1 },
      },
    },
    {
      $project: { _id: 1, totalOwners: 1 },
    },
    {
      $sort: { totalOwners: 1 },
    },
    {
      $facet: {
        Owners: [{ $count: 'total' }],
      },
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
        totalCars: { $sum: 1 },
      },
    },
    {
      $project: { _id: 1, totalCars: 1 },
    },
    {
      $sort: { totalCars: 1 },
    },
    {
      $facet: {
        Owners: [{ $count: 'total' }],
      },
    },
  ]);

  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});

exports.ownersMonthlyStats = catchAsync(async (req, res, next) => {
  const { max, min } = req.params;

  const result = await Ads.aggregate([
    {
      $match: {
        createdAt: { $lte: moment(max).toDate(), $gte: moment(min).toDate() },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        // ownersID: { $push: '$createdBy' },
      },
    },
    {
      $addFields: {
        date: '$_id',
      },
    },
    {
      $project: {
        _id: 1,
        count: 1,
        // ownersID: 1,
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $facet: { metadat: [{ $count: 'Total' }] },
    },
  ]);

  //     { $project: { month_joined: { $month: '$createdAt' } } },
  //     { $group: { _id: { joinedInMonth: '$month_joined' }, number: { $sum: 1 } } },
  //     { $sort: { '_id.month_joined': 1 } },
  //   ]);

  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});
