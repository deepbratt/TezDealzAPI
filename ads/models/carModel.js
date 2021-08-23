const mongoose = require('mongoose');
const validator = require('validator');
const { ERRORS } = require('@constants/tdb-constants');

const carsSchema = new mongoose.Schema(
	{
		country: {
			type: String,
			validate: [validator.isAlpha, `country ${ERRORS.REQUIRED.ONLY_APLHA_REQUIRED}`],
		},
		province: {
			type: String,
			validate: [validator.isAlpha, `province ${ERRORS.REQUIRED.ONLY_APLHA_REQUIRED}`],
		},
		city: {
			type: String,
			validate: [validator.isAlpha, `city ${ERRORS.REQUIRED.ONLY_APLHA_REQUIRED}`],
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
				values: ['Diesel', 'Petrol', 'CNG', 'LPG', 'Hybird', 'Electric'],
				message: ERRORS.INVALID.INVALID_ENGINE_TYPE,
			},
		},
		transmission: {
			type: String,
			required: [true, ERRORS.REQUIRED.TRANSMISSION_TYPE_REQUIRED],
			enum: {
				values: ['Manual', 'Automatic'],
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
					'Sedan',
					'SUV',
					'Sports',
					'Convertible',
					'Pick Up ',
					'Coupe',
					'Hatchback',
					'Mini Van',
					'MPV',
					'Micro Van',
					'Mini Vehicles',
					'Station Wagon',
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
			required: [true, `Registeration city ${ERRORS.REQUIRED.ONLY_APLHA_REQUIRED}`],
			validate: [validator.isAlpha, `Registeration city ${ERRORS.REQUIRED.ONLY_APLHA_REQUIRED}`],
		},
		milage: {
			type: Number,
			required: [true, ERRORS.REQUIRED.MILAGE_REQUIRED],
		},
		assembly: {
			type: String,
			required: [true, ERRORS.REQUIRED.ASSEMBLY_REQUIRED],
			enum: {
				values: ['Local', 'Imported'],
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
		isFav: {
			type: Boolean,
			default: undefined,
		},
		isSold: {
			type: Boolean,
			required: true,
			default: false,
		},
		active: {
			type: Boolean,
			required: true,
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
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

carsSchema.index({
	country: 'text',
	province: 'text',
	city: 'text',
	model: 'text',
	make: 'text',
	bodyColor: 'text',
	engineType: 'text',
	condition: 'text',
	description: 'text',
	bodyType: 'text',
});

const Car = mongoose.model('Car', carsSchema);

module.exports = Car;
