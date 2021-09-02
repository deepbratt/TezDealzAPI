const mongoose = require('mongoose');

const carModels = new mongoose.Schema({
	model_id: {
		type: Number,
		unique: true,
		required: true,
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
	versions: [Object],
});

const CarModel = mongoose.model('CarModels', carModels);
module.exports = CarModel;
