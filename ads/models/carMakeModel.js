const mongoose = require('mongoose');

const carMakeModelSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const CarMakeModel = mongoose.model('CarMakeModel', carMakeModelSchema);
module.exports = CarMakeModel;
