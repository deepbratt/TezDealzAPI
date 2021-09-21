const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Car = require('../models/cars/carModel');
const CarMake = require('../models/cars/make-model/car_make');
const CarModel = require('../models/cars/make-model/car_model');
const CarVersion=require('../models/cars/make-model/car_version');
dotenv.config({ path: '../config/config.env' });

const DB = process.env.DB_REMOTE;

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log('connection successfull'))
	.catch((err) => {
		console.log(err);
	});
//
//const makes = JSON.parse(fs.readFileSync(`${__dirname}/makes_1.json`, 'utf-8'));
//const models = JSON.parse(fs.readFileSync(`${__dirname}/models-versions_2.json`, 'utf-8'));
const versions = JSON.parse(fs.readFileSync(`${__dirname}/version.json`, 'utf-8'));
// console.log(models);

const importData = async () => {
	try {
		//await CarMake.insertMany(makes); 		
		await CarVersion.insertMany(versions) 		
		//await CarModel.insertMany(models);
		console.log('data is successfuly loaded');
	} catch (error) {
		console.log(error);
	}
	process.exit();
};
// const deleteData = async () => {
// 	try {
// 		await Tour.deleteMany();
// 		await User.deleteMany();
// 		await Review.deleteMany();
// 		console.log('data deleted successfuly');
// 	} catch (error) {
// 		console.log(error);
// 	}
// 	process.exit();
// };
if (process.argv[2] === '--import') {
	importData();
	// } else if (process.argv[2] === '--delete') {
	// 	deleteData();
}
