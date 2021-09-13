const mongoose = require('mongoose');

const featuresSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Provide feature name'],
    unique: true,
  },
  image: {
    type: String,
    required: [true, 'Please Provide feature image'],
  },
});

const Features = mongoose.model('Features', featuresSchema);

module.exports = Features;
