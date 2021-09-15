const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const carModels = new mongoose.Schema({
	model_id: {
		type: Number,
		unique: true,
	},
	make_id: {
		type: Number,
		index: true,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	versions: [
		{
			name: {
				type: String,
				required: [true, 'name is required'],
			},
			fuel_type: {
				type: String,
			},
			transmission_type: {
				type: String,
			},
		},
	],
});

carModels.pre('save', async function (next) {
	let randomNumber;
	do {
		randomNumber = Math.floor(Math.random() * (999 - 10) + 10);
	} while (
		await CarModel.findOne({
			model_id: randomNumber,
		})
	);
	this.model_id = randomNumber;
	return randomNumber;
});

const CarModel = mongoose.model('CarModel', carModels);
module.exports = CarModel;
