const Car = require('../../models/cars/carModel');
const BulkUploads = require('../../models/bulkUploads/bulkUploads');
const { AppError, catchAsync, uploadS3 } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const fastcsv = require('@fast-csv/parse');
const { uploadFile } = require('../../utils/fileUpload');
const { filter } = require('../factory/factoryHandler');

exports.createBulkUploads = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please insert a CSV File to add data', STATUS_CODE.BAD_REQUEST));
  }
  // Parsing csv file from buffer
  let results = [];
  fastcsv
    .parseString(req.file.buffer, { headers: true, ignoreEmpty: true })
    .validate((data) => data.regNumber !== '')
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      if (!results || results.length <= 0) {
        return next(
          new AppError(
            'No data available to insert or something is missing or incorrect',
            STATUS_CODE.BAD_REQUEST,
          ),
        );
      }
      // creating records in ads collection from parsed file data
      results.forEach((e) => {
        e.createdBy = req.params.id;
      });
      await Car.create(results);
    });

  // Uploading file to s3 Bucket
  const file = req.file;
  const { Location } = await uploadFile(file);
  req.body.csvFile = Location;

  const result = await BulkUploads.create({ csvFile: Location, user_Id: req.user._id });

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
    totalPostedAds: results.length,
    data: {
      result,
    },
  });
});

exports.getAllBulkAds = catchAsync(async (req, res, next) => {
  const [result, totalCount] = await filter(BulkUploads.find(), req.query);

  if (!result || result.length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    countOnPage: result.length,
    totalCount: totalCount,
    data: {
      result,
    },
  });
});

exports.getOneBulkAd = catchAsync(async (req, res, next) => {
  const result = await BulkUploads.findById(req.params.id);

  if (!result || result.length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
    data: {
      result,
    },
  });
});

exports.UpdateBulkAd = catchAsync(async (req, res, next) => {
  const result = await BulkUploads.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!result || result.length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
    data: {
      result,
    },
  });
});

exports.deleteBulkAd = catchAsync(async (req, res, next) => {
  const result = await BulkUploads.findByIdAndDelete(req.params.id);

  if (!result || result.length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE,
  });
});
