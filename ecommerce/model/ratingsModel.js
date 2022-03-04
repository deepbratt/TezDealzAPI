const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const { ERRORS } = require('@constants/tdb-constants');

const ratingsSchema = new mongoose.Schema(
  {
    productId:{
        type: String,
        required:[true, ERRORS.REQUIRED.PRODUCT_ID]
    },
    rating: {
        type: Number,
        required: [true, ERRORS.REQUIRED.RATING]
    },
    userId:{
        type: String,
        required: [true, ERRORS.REQUIRED.USER_ID]
    },
    review: {
        title: String,
        description: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// carsSchema.index({ active: -1, isSold: 1, banned: 1 });
// carsSchema.index({ location: '2dsphere' });

// carsSchema.index({
//   country: 'text',
//   province: 'text',
//   city: 'text',
//   model: 'text',
//   make: 'text',
//   bodyColor: 'text',
//   engineType: 'text',
//   condition: 'text',
//   bodyType: 'text',
//   assembly: 'text',
//   transmission: 'text',
// });

// carsSchema.pre('save', async function (next) {
//   if (
//     this.isModified('bodyColor ') ||
//     this.isModified('make') ||
//     this.isModified('model') ||
//     this.isModified('city') ||
//     this.isModified('modelYear') ||
//     this.isNew
//   ) {
//     this.slug = slugify(
//       `${this.bodyColor}-${this.make}-${this.model}-in-${this.city}-${this.modelYear}-${this._id}`,
//     );
//   }
//   next();
// });
// carsSchema.pre('save', function (next) {
//   if (this.isNew && Array.isArray(this.location) && 0 === this.location.length) {
//     this.location = undefined;
//   }
//   next();
// })

const Ratings = mongoose.model('Ratings', ratingsSchema);

module.exports = Ratings;
