const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User"
    },
    products: [
      {
        productId: String,
        quantity: Number,
        name: String,
        price: Number
      }
    ],
    active: {
      type: Boolean,
      default: true
    },
    modifiedOn: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, }
);

module.exports = mongoose.model("Cart", CartSchema);