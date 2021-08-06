const mongoose = require('mongoose');
const validator = require('validator');
const { ERRORS } = require('@constants/tdb-constants');

const carsSchema = new mongoose.Schema(
	{
		country: {
			type: String,
			validate: [validator.isAlpha, ERRORS.REQUIRED.ONLY_APLHA_REQUIRED],
			lowercase: true,
		},
		province: {
			type: String,
			validate: [validator.isAlpha, ERRORS.REQUIRED.ONLY_APLHA_REQUIRED],
			lowercase: true,
		},
		city: {
			type: String,
			validate: [validator.isAlpha, ERRORS.REQUIRED.ONLY_APLHA_REQUIRED],
			lowercase: true,
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
		images: [
			{
				type: String,
				required: [true, ERRORS.REQUIRED.IMAGE_REQUIRED],
			},
		],
		model: String,
		make: String,
		price: Number,
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
		bodyColor: String,
		engineCapacity: Number,
		registrationCity: {
			type: String,
			trim: true,
			lowercase: true,
			validate: [validator.isAlpha, ERRORS.REQUIRED.ONLY_APLHA_REQUIRED],
		},
		milage: Number,
		assembly: {
			type: String,
			required: [true, ERRORS.REQUIRED.ASSEMBLY_REQUIRED],
			enum: {
				values: ['Local', 'Imported'],
				message: ERRORS.INVALID.INVALID_ASSEMBLY,
			},
		},
		features: [{ type: String, required: [true, ERRORS.REQUIRED.FEATURES_REQUIRED] }],
		description: String,
		date: {
			type: Date,
			default: Date.now(),
		},
		favOf: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Car = mongoose.model('Car', carsSchema);

module.exports = Car;
