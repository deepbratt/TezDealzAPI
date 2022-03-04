const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const { ERRORS } = require('@constants/tdb-constants');

const productsSchema = new mongoose.Schema(
  {
    ratingsCount:{
      count1:  { type: Number, default: 0 },
      count2: { type: Number, default: 0 },
      count3:{ type: Number, default: 0 },
      count4: { type: Number, default: 0 },
      count5: { type: Number, default: 0 }
    },
    expiryDate:{
      type: Number,
      min: [Number(new Date().getFullYear()), ERRORS.INVALID.EXPIRY_DATE],
      required: [true, ERRORS.REQUIRED.EXPIRY_DATE],
    },
    productTitle: {
      type: String,
      required: [true, ERRORS.REQUIRED.PRODUCT_TITLE]
    },
    available:{
      type: Boolean,
      index: true,
      default: true,
      required: [true, ERRORS.REQUIRED.AVAILABLE]
    },
    stockCount:{
      type: Number,
      required: [true, ERRORS.REQUIRED.STOCK_COUNT]
    },
    category:{
      type: String,
      required: [true, ERRORS.REQUIRED.CATEGORY]
    },
    subCategory: {
      type: String,
    },
    country: {
      type: String,
      required: [true, ERRORS.REQUIRED.COUNTRY_NAME],
    },
    city: {
      type: String,
      required: [true, ERRORS.REQUIRED.CITY_NAME],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        // default: 'Point',
      },
      coordinates: [Number],
      address: String,
      required: false,
    },
    // createdBy: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    // },
    image: [
      {
        _id: false,
        reference: {
          type: String,
        },
        location: {
          type: String,
        },
      },
    ],
    make: {
      type: String,
      required: [true, ERRORS.REQUIRED.CAR_MAKE_REQUIRED],
    },
    originalPrice: {
      type: Number,
      required: [true, ERRORS.REQUIRED.PRICE_REQUIRED],
    },
    price: {
      type: Number,
      required: [true, ERRORS.REQUIRED.PRICE_REQUIRED],
    },
    bodyColor: {
      type: String,
      required: [true, ERRORS.REQUIRED.BODY_COLOR_REQUIRED],
    },
    description: {
      type: String,
      required: [true, ERRORS.REQUIRED.DESCRIPTION_REQUIRED],
    },
    favOf: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    soldByUs: {
      type: Boolean,
    },
    // active: {
    //   type: Boolean,
    //   index: true,
    //   default: true,
    // },
    sellerType: {
      type: String,
      required: [true, ERRORS.REQUIRED.SELLER_TYPE_REQUIRED],
      enum: {
        values: ['Dealer', 'Individual', 'Not Available'],
        message: ERRORS.INVALID.INVALID_SELLER_TYPE,
      },
    },
    banned: {
      type: Boolean,
      index: true,
      default: false,
    },
    imageStatus: {
      type: Boolean,
    },
    views: {
      type: Number,
      default: 0,
    },
    selectedImage: {
      _id: false,
      reference: {
        type: String,
      },
      location: {
        type: String,
      },
    },

    slug: {
      type: String,
      unique: true,
    },
    isPublished: {
      type: Boolean,
    },
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

const Product = mongoose.model('Product', productsSchema);

module.exports = Product;
