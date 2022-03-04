const Ratings = require('../model/ratingsModel');
const { AppError, catchAsync, uploadS3 } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');
const Product = require('../model/productModel');

//  Adding Products

exports.addReview = catchAsync(async(req,res,next)=>{
    if (!req.body){
        return next(
            new AppError(
              "You have not passed any review data",
              STATUS_CODE.BAD_REQUEST,
            ),
          );
    }
    let pId = req.body.productId
    let uId = req.body.userId 
    let test = await Ratings.find({ productId: pId,userId: uId })
    if(test.length>0){
        return next(
            new AppError(
              "You have already added your ratings",
              STATUS_CODE.BAD_REQUEST,
            ),
          );
    }
        let ratingNum = req.body.rating
        let key = "ratingsCount.count"+ratingNum
        console.log(key)
      //   let result = await Product.updateOne(
      //     { "_id": pId },
      //     { $inc: {key: 1 } }
      //  )
      // let result = Product.update({"_id": pId}, {$inc:{"ratingsCount.count3": 1}}, {new: true})
      //  if(result.err){
      //   //  Error
      //   console.log("Error")
      //  }
      //  console.log(result)

        let ratings = await Ratings.create(req.body);
        if (ratings.err) { console.log('error');}
        else { 
          res.status(STATUS_CODE.CREATED).json({
            status: STATUS.SUCCESS,
            message: "Ratings Added Successfully",
            data: ratings,
          });
        }
})



exports.getRatings = catchAsync(async(req,res,next)=>{
  const result = await (Ratings.find({"productId": req.params.id}));
  sum =0;
  let count_1 = 0;
  let count_2 = 0;
  let count_3 = 0;
  let count_4 = 0;
  let count_5 = 0;
  for(let x=0; x<result.length; x++){
    sum = sum + result[x].rating 
    if(result[x].rating == 1){
      count_1 = count_1 + 1
    }else if(result[x].rating == 2){
      count_2 = count_2 + 1
    }else if(result[x].rating == 3){
      count_3 = count_3 + 1
    }else if(result[x].rating == 4){
      count_4 = count_4 + 1
    }else if(result[x].rating == 5){
      count_5 = count_5 + 1
    }

  }
  let numOfRating = result.length;
  ratingCount= [
    {"1": count_1, 
    "percent": Math.round((count_1*100)/numOfRating)},
    {"2": count_2, 
    "percent": Math.round((count_2*100)/numOfRating)},
    {"3": count_3, 
    "percent": Math.round((count_3*100)/numOfRating)},
    {"4": count_4, 
    "percent": Math.round((count_4*100)/numOfRating)},
    {"5": count_5, 
    "percent": Math.round((count_5*100)/numOfRating)},
  ]
  
  let avgRating = sum / result.length

//   let numOfReviews = Ratings.find({ review: { $exists: true, $ne: [] } })
  if(result.err){
    //   error
  }

  if (result.length <= 0) {
      return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
    res.status(STATUS_CODE.CREATED).json({
      status: STATUS.SUCCESS,
      message: "Ratings of individual product",
      data: result,
      numOfRatings: result.numOfRating,
      numOfReviews: result.length,
      avgRating: Math.round(avgRating,2),
      ratingCount: ratingCount
    });    
})
