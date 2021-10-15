const mongoose = require('mongoose');

const showNumbers = new mongoose.Schema(
  {
    buyer_details: {
      type: String,
    },
    seller_details: {
      type: String,
    },
    car_details: {
      type: String,
    },
    clickedDate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

showNumbers.index({ buyer_details: 1, seller_details: 1, car_details: 1 });

const ShowNumber = mongoose.model('ShowNumber', showNumbers);

module.exports = ShowNumber;
