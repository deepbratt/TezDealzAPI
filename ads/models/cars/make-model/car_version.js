const mongoose = require('mongoose');

const carversions = new mongoose.Schema(
	{
		model_id: {
			type: Number,
			index: true,
			required: true,
		},
		name: {
			type: String,
			required: [true, 'name is required'],
		},
		capacity:{
			type:Number,
		},
		fuel_type: {
			type: String,
		},
		transmission_type: {
			type: String,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const CarVersion = mongoose.model('CarVersion', carversions);
module.exports = CarVersion;
