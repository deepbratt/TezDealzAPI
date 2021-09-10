const mongoose = require('mongoose');

const carViews = new mongoose.Schema({
	ip: {
		type: string,
		required: true,
	},
	car_id: {
		type: String,
		required: true,
	},
});

const CarView = mongoose.model('CarView', carViews);
module.exports = CarView;
