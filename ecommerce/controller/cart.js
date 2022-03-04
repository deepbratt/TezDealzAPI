const Cart = require('../model/cartModel');
const { AppError, catchAsync, uploadS3 } = require('@utils/tdb_globalutils');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');


// Add to cart
exports.addCart = catchAsync(async(req,res,next)=>{
    const { userId,productId, quantity, name, price } = req.body;
    try {
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.productId == productId);
  
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.quantity = quantity;
          cart.products[itemIndex] = productItem;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({ productId, quantity, name, price });
        }
        cart = await cart.save();
        return res.status(201).send(cart);
      } else {
        //no cart for user, create new cart
        const newCart = await Cart.create({
          userId,
          products: [{ productId, quantity, name, price }]
        });
  
        return res.status(201).send(newCart);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
})

exports.removeCart= catchAsync(async(req,res,next)=>{
    const { userId,productId } = req.body;
    try{
        // let cart = await Cart.findOne({ userId });
        // if(cart){
          let updatedCart= await Cart.update({"userId": userId},{$pull:{"products":{"productId":productId}}},{multi:true})
          return res.status(201).send(updatedCart);
        // }else{
        //   return res.status(400).send("Not any product found")
        // }
        
    }catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      }
})

exports.getCart=catchAsync(async(req,res,next)=>{
  const result = await (Cart.findOne({"userId": req.params.id}));

  if(result.err){
      
  }

  if (result.length <= 0) {
      return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
  }
    res.status(STATUS_CODE.CREATED).json({
      status: STATUS.SUCCESS,
      message: "Cart items",
      data: result,
      totalCount: result.length
    }); 
})

