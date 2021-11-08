const Car = require('../../models/cars/carModel');
const BulkUploads = require('../../models/bulkUploads/bulkUploads');
const { AppError, catchAsync, uploadS3 } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const fastcsv = require('@fast-csv/parse');
const { uploadFile } = require('../../utils/fileUpload');

exports.createBulkUploads = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please insert a CSV File to add data', STATUS_CODE.BAD_REQUEST));
  }
  // Parsing csv file from buffer
  const results = [];
  fastcsv
    .parseString(req.file.buffer, { headers: true, ignoreEmpty: true })
    .on('data', (data) => results.push(data))
    .validate((data) => data.createdBy !== '')
    .on('end', async () => {
      if (!results || results.length <= 0) {
        return next(
          new AppError(
            'No data available to insert or User Id is missing',
            STATUS_CODE.BAD_REQUEST,
          ),
        );
      }
      // creating records in ads collection from parsed file data
      try {
        await Car.create(results);

        // Uploading file to s3 Bucket
        const file = req.file;
        const { Location } = await uploadFile(file);
        req.body.csvfile = Location;

        const result = await BulkUploads.create({ csvFile: Location });

        res.status(STATUS_CODE.CREATED).json({
          status: STATUS.SUCCESS,
          message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
          totalPostedAds: results.length,
          data: {
            result,
          },
        });
      } catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: 'Duplicate Registration Number',
          errorMessage: err.keyValue,
        });
      }
    });
});
