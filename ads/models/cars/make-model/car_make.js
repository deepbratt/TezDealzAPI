const mongoose = require('mongoose');

const carMake = new mongoose.Schema({
	make_id: {
		type: Number,
		index: true,
		unique: true,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});

const CarMake = mongoose.model('CarMake', carMake);
module.exports = CarMake;
