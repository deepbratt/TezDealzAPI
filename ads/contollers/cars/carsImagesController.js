const CarImages = require('../../models/cars/carsImages/carsImagesModel');
const { AppError, catchAsync, uploadS3WithTag } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS, ROLES } = require('@constants/tdb-constants');
const { filter } = require('../factory/factoryHandler');
var sizeOf = require('image-size');

exports.imageUploader = catchAsync(async (req, res, next) => {
  let arrayOfImages = [];
  let selectedImage;
  let errorImage = [];

  if (req.files.selectedImage) {
    let { Location, Key } = await uploadS3WithTag(
      req.files.selectedImage[0],
      process.env.AWS_BUCKET_REGION,
      process.env.AWS_ACCESS_KEY,
      process.env.AWS_SECRET_KEY,
      process.env.AWS_BUCKET_NAME,
    );
    selectedImage = { reference: Key, location: Location };
  }

  if (req.files.image) {
    for (var i = 0; i < req.files.image.length; i++) {
      if(sizeOf.width <= 1080 || sizeOf.height <=720){
        let { Location, Key } = await uploadS3(
          req.files.image[i],
          process.env.AWS_BUCKET_REGION,
          process.env.AWS_ACCESS_KEY,
          process.env.AWS_SECRET_KEY,
          process.env.AWS_BUCKET_NAME,
        );
        arrayOfImages.push({ reference: Key, location: Location });  
      }else{
        errorImage.push(req.files.image[i]);
      }
    }
  }
  const result = await CarImages.create({
    createdBy: req.user._id,
    images: arrayOfImages,
    selectedImage: selectedImage,
  });

  if(errorImage.length == 0){
    res.status(STATUS_CODE.CREATED).json({
      stats: STATUS.SUCCESS,
      message: 'Images Uploaded Successfully',
      data: {
        result,
      },
    });
  }else{
    res.status(STATUS_CODE.CREATED).json({
      stats: 209,
      message: 'Images are in lower resolution than expected',
      data: {
        errorImage,
      },
    });
  }
});

exports.getAllCarImages = catchAsync(async (req, res, next) => {
  const [result, totalCount] = await filter(CarImages.find(), req.query);

  if (!result || result.length <= 0) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: 'List of all car images',
    countOnPage: result.length,
    totalCount: totalCount,
    data: {
      result,
    },
  });
});

exports.getOneCarImage = catchAsync(async (req, res, next) => {
  const result = await CarImages.findById(req.params.id).populate({
    path: 'createdBy',
    model: 'User',
    select: 'firstName lastName phone',
  });

  if (!result) {
    return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }

  res.status(STATUS_CODE.OK).json({
    status: STATUS.SUCCESS,
    message: 'Car images against that specific id',
    data: {
      result,
    },
  });
});
