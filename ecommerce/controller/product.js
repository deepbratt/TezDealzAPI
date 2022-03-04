const Product = require('../model/productModel');
const { AppError, catchAsync, uploadS3 } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');


//  Adding Products

exports.addProduct = catchAsync(async(req,res,next)=>{
    if (!req.body){
        return next(
            new AppError(
              "You have not passed any product data",
              STATUS_CODE.BAD_REQUEST,
            ),
          );
    }
        let product = await Product.create(req.body);
        if (product.err) { console.log('error');}
        else { 
          res.status(STATUS_CODE.CREATED).json({
            status: STATUS.SUCCESS,
            message: "Product Added Successfully",
            data: product
          });
        }
})

exports.listProduct = catchAsync(async(req,res,next)=>{
    const result = await (Product.find());

    if(result.err){
        
    }

    if (result.length <= 0) {
        return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
      res.status(STATUS_CODE.CREATED).json({
        status: STATUS.SUCCESS,
        message: "List of all products",
        data: result,
        totalCount: result.length
      });    
})

exports.getProduct = catchAsync(async(req,res,next)=>{
  const result = await (Product.findOne({"_id": req.params.id}));

  if(result.err){
      
  }

  if (result.length <= 0) {
      return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
    res.status(STATUS_CODE.CREATED).json({
      status: STATUS.SUCCESS,
      message: "Products Details of individual product",
      data: result,
      totalCount: result.length
    });    
})
