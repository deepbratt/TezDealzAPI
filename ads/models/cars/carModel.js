const mongoose = require('mongoose');
const validator = require('validator');
const { ERRORS } = require('@constants/tdb-constants');
//const BodyType = require('../../models/cars/bodyTypes/bodyTypes');
//const Features = require('../../models/cars/features/featuresModel');

// let carFeatures = async function () {
//   let result = await Features.find().select('name image');
//   return result;
// };

// console.log(carFeatures);

const carsSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, ERRORS.REQUIRED.COUNTRY_NAME],
    },
    province: {
      type: String,
      required: [true, ERRORS.REQUIRED.PROVINCE_NAME],
    },
    city: {
      type: String,
      required: [true, ERRORS.REQUIRED.CITY_NAME],
    },
    location: {
      type: {
        type: String,
        default: 'point',
        enum: ['point'],
      },
      coordinates: {
        lat: Number,
        long: Number,
      },
      address: String,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    image: [String],
    version: {
      type: String,
    },
    regNumber: {
      type: String,
      unique: true,
      index: true,
      validate: [
        validator.isAlphanumeric,
        `${ERRORS.INVALID.INVALID_REG_NUM}.${ERRORS.REQUIRED.APLHA_NUMERIC_REQUIRED}`,
      ],
      required: [true, ERRORS.REQUIRED.REG_NUMBER_REQUIRED],
    },
    model: {
      type: String,
      required: [true, ERRORS.REQUIRED.CAR_MODEL_REQUIRED],
    },
    modelYear: {
      type: Number,
      min: [1960, ERRORS.INVALID.INVALID_MODEL_YEAR],
      max: [Number(new Date().getFullYear()), ERRORS.INVALID.INVALID_MODEL_YEAR],
      required: [true, ERRORS.REQUIRED.MODEL_YEAR_REQUIRED],
    },
    make: {
      type: String,
      required: [true, ERRORS.REQUIRED.CAR_MAKE_REQUIRED],
    },
    price: {
      type: Number,
      min: [10000, ERRORS.INVALID.MINIMUM_PRICE],
      required: [true, ERRORS.REQUIRED.PRICE_REQUIRED],
    },
    engineType: {
      type: String,
      required: [true, ERRORS.REQUIRED.ENGINE_TYPE_REQUIRED],
      enum: {
        values: ['CNG', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'Petrol'],
        message: ERRORS.INVALID.INVALID_ENGINE_TYPE,
      },
    },
    transmission: {
      type: String,
      required: [true, ERRORS.REQUIRED.TRANSMISSION_TYPE_REQUIRED],
      enum: {
        values: ['Automatic', 'Manual'],
        message: ERRORS.INVALID.INVALID_TRANSMISSION_TYPE,
      },
    },
    condition: {
      type: String,
      required: [true, ERRORS.REQUIRED.CONDITION_REQUIRED],
      enum: {
        values: ['Excellent', 'Good', 'Bad'],
        message: ERRORS.INVALID.INVALID_CONDITION,
      },
    },
    bodyType: {
      type: String,
      required: [true, ERRORS.REQUIRED.BODY_TYPE_REQUIRED],
      enum: {
        values: [
          'Compact sedan',
          'Compact SUV',
          'Mini Van',
          'Coupe',
          'Convertible',
          'Crossover',
          'Double Cabin',
          'High Roof',
          'Micro Van',
          'Mini Vehicles',
          'MPV',
          'Off-Road Vehicles',
          'Pick Up',
          'Sedan',
          'Single Cabin',
          'Station Wagon',
          'Subcompact hatchback',
          'SUV',
          'Truck',
          'Van',
        ],
        message: ERRORS.INVALID.INVALID_BODY_TYPE,
      },
      trim: true,
    },
    bodyColor: {
      type: String,
      required: [true, ERRORS.REQUIRED.BODY_COLOR_REQUIRED],
    },
    engineCapacity: {
      type: Number,
      min: [200, ERRORS.INVALID.MINIMUM_ENGINE_CAPACITY],
      required: [true, ERRORS.REQUIRED.ENGINE_CAPACITY_REQUIRED],
    },
    registrationCity: {
      type: String,
      trim: true,
      required: [true, ERRORS.REQUIRED.REGISTRATION_CITY],
    },
    milage: {
      type: Number,
      required: [true, ERRORS.REQUIRED.MILAGE_REQUIRED],
    },
    assembly: {
      type: String,
      required: [true, ERRORS.REQUIRED.ASSEMBLY_REQUIRED],
      enum: {
        values: ['Imported', 'Local'],
        message: ERRORS.INVALID.INVALID_ASSEMBLY,
      },
    },
    features: [{ type: String, required: [true, ERRORS.REQUIRED.FEATURES_REQUIRED] }],
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
    isFav: {
      type: Boolean,
      default: undefined,
    },
    isSold: {
      type: Boolean,
      index: true,
      default: false,
    },
    active: {
      type: Boolean,
      index: true,
      default: true,
    },
    sellerType: {
      type: String,
      required: [true, ERRORS.REQUIRED.SELLER_TYPE_REQUIRED],
      enum: {
        values: ['Dealer', 'Individual'],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

carsSchema.index({ active: -1, isSold: 1, banned: 1 });

carsSchema.index({
  country: 'text',
  province: 'text',
  city: 'text',
  model: 'text',
  make: 'text',
  bodyColor: 'text',
  engineType: 'text',
  condition: 'text',
  bodyType: 'text',
  assembly: 'text',
  transmission: 'text',
});

const Car = mongoose.model('Car', carsSchema);

module.exports = Car;
