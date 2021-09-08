const mongoose = require('mongoose');

const carMake = new mongoose.Schema({
  make_id: {
    type: Number,

    unique: [true, 'Please provide a unique make id'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const CarMake = mongoose.model('CarMake', carMake);
module.exports = CarMake;
