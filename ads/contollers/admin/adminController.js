const Car = require('../../models/cars/carModel');
const moment = require('moment');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');

exports.totalOwners = catchAsync(async (req, res, next) => {
  const result = await Car.aggregate([
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
  const result = await Car.aggregate([
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
  const result = await Car.aggregate([
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
  ]);

  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});

exports.carsOwnersMonthlyStats = catchAsync(async (req, res, next) => {
  const result = await Car.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'user_doc',
      },
    },
    {
      $match: {
        $expr: {
          $eq: [{ $year: '$user_doc.createdAt' }, { $year: new Date() }],
          $eq: [{ $month: '$user_doc.createdAt' }, { $month: new Date() }],
        },
      },
    },
    {
      $group: {
        _id: '$user_doc.createdAt',
        ownerCreated: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});

exports.carsAddedToday = catchAsync(async (req, res, next) => {
  const result = await Car.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $year: '$createdAt' }, { $year: new Date() }],
          $eq: [{ $month: '$createdAt' }, { $month: new Date() }],
          $eq: [{ $dayOfMonth: '$createdAt' }, { $dayOfMonth: new Date() }],
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
      $count: 'count',
    },
  ]);
  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});

exports.ownersJoinedToday = catchAsync(async (req, res, next) => {
  const result = await Car.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'user_doc',
      },
    },
    {
      $match: {
        $expr: {
          $eq: [{ $year: '$user_doc.createdAt' }, { $year: new Date() }],
          $eq: [{ $month: '$user_doc.createdAt' }, { $month: new Date() }],
          $eq: [{ $dayOfMonth: '$user_doc.createdAt' }, { $dayOfMonth: new Date() }],
        },
      },
    },
    {
      $group: {
        _id: '$user_doc.createdAt',
        carCreated: { $sum: 1 },
      },
    },
    {
      $count: 'count',
    },
  ]);
  res.status(200).json({
    status: STATUS.SUCCESS,
    result,
  });
});
