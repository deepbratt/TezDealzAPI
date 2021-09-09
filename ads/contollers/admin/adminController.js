const Car = require('../../models/cars/carModel');
const moment = require('moment');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');

exports.carOwners = catchAsync(async (req, res, next) => {
	const count = await Car.aggregate([
		{
			$facet: {
				total: [
					{
						$group: {
							_id: '$createdBy',
						},
					},
					{
						$project: { _id: 0, totalOwners: 0 },
					},
					{
						$count: 'count',
					},
				],
				monthly: [
					{
						$lookup: {
							from: 'users',
							localField: 'createdBy',
							foreignField: '_id',
							as: 'user_doc',
						},
					},
					{
						$unwind: '$user_doc',
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
							_id: '$user_doc._id',
							owners: { $sum: 1 },
						},
					},
					{
						$count: 'count',
					},
				],
				today: [
					{
						$lookup: {
							from: 'users',
							localField: 'createdBy',
							foreignField: '_id',
							as: 'user_doc',
						},
					},
					{
						$unwind: '$user_doc',
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
							_id: '$user_doc._id',
							owners: { $sum: 1 },
						},
					},
					{
						$count: 'count',
					},
				],
			},
		},
	]);

	res.status(200).json({
		status: STATUS.SUCCESS,
		data: {
			result: {
				total: count[0].total.length > 0 ? count[0].total[0].count : 0,
				monthly: count[0].monthly.length > 0 ? count[0].monthly[0].count : 0,
				today: count[0].today.length > 0 ? count[0].today[0].count : 0,
			},
		},
	});
});

exports.cars = catchAsync(async (req, res, next) => {
	const count = await Car.aggregate([
		{
			$facet: {
				total: [
					{
						$group: {
							_id: '$_id',
						},
					},
					{
						$project: { _id: 0, totalOwners: 0 },
					},
					{
						$count: 'count',
					},
				],
				monthly: [
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
						$count: 'count',
					},
				],
				today: [
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
							_id: '$_id',
							cars: { $sum: 1 },
						},
					},
					{
						$count: 'count',
					},
				],
			},
		},
	]);

	res.status(200).json({
		status: STATUS.SUCCESS,
		data: {
			result: {
				total: count[0].total.length > 0 ? count[0].total[0].count : 0,
				monthly: count[0].monthly.length > 0 ? count[0].monthly[0].count : 0,
				today: count[0].today.length > 0 ? count[0].today[0].count : 0,
			},
		},
	});
});
