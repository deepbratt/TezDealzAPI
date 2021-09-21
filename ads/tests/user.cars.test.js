const app = require('../server');
const Car = require('../models/cars/carModel');
const mongoose = require('mongoose');
const supertest = require('supertest');
//user
const userToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyZGF0YSI6eyJpZCI6IjYxNDM1NTE1MTIwZjYzM2QyY2RhYzRlMSJ9LCJpYXQiOjE2MzE4MDI2NTQsImV4cCI6NjgxNTgwMjY1NH0.RJC6aMq-wqsCicQ3saU4orL0syNpr7ZlROokWKa580s';

let obj = {
	country: 'Pakistan',
	province: 'Punjab',
	city: 'Lahore',
	make: 'HONDA',
	model: 'Honda city',
	brand: 'HONDA',
	price: 1500000000,
	image: 'myimage.png',
	engineType: 'Petrol',
	transmission: 'Automatic',
	condition: 'Excellent',
	bodyType: 'Sedan',
	bodyColor: 'red',
	engineCapacity: 800,
	registrationCity: 'Lahore',
	milage: 23000,
	assembly: 'Local',
	features: 'Local Manufatured',
	description: 'Latest car in market',
	regNumber: 'str5656',
	modelYear: 2019,
	sellerType: 'Individual',
	createdBy: '61435515120f633d2cdac4e1',
};

beforeEach((done) => {
	mongoose.connect(
		process.env.DB_LOCAL,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		() => done()
	);
});

afterEach((done) => {
	mongoose.connection.db.dropCollection('cars', () => {
		mongoose.connection.close(() => done());
	});
});

test('GET /v1/ads/cars', async () => {
	const car = await Car.create(obj);

	await supertest(app)
		.get(`/v1/ads/cars/${car._id}`)
		.expect(200)
		.then((response) => {
			// Check type and length
			expect(response.body).toBeTruthy();
			//expect(response.body.data).toEqual(1);

			// Check data
			expect(response.body.data.result.id).toBe(car.id);
			expect(response.body.data.result.modelYear).toBe(car.modelYear);
			expect(response.body.data.result.regNumber).toBe(car.regNumber);
		});
});

test('POST /v1/ads/cars', async () => {
	await supertest(app)
		.post('/v1/ads/cars')
		.send(obj)
		.set('Authorization', `Bearer ${userToken}`)
		.expect(201)
		.then(async (response) => {
			// Check the response
			expect(response.body.data.result).toBeTruthy();
			// Check data in the database
			const car = await Car.findOne({ _id: response.body.data.result._id });
			expect(car).toBeTruthy();
			expect(car.modelYear).toBe(obj.modelYear);
			expect(car.regNumber).toBe(obj.regNumber);
		});
});

test('PATCH /v1/ads/cars/:id', async () => {
	const car = await Car.create(obj);

	const data = {
		description: 'oldest car in market',
		image: 'apps.png',
		regNumber: 'ABC1234',
	};

	await supertest(app)
		.patch('/v1/ads/cars/' + car.id)
		.send(data)
		.set('Authorization', `Bearer ${userToken}`)
		.expect(200)
		.then(async (response) => {
			// Check the response
			expect(response.body.data.result._id).toBe(car.id);
			expect(response.body.data.result.description).toBe(data.description);
			expect(response.body.data.result.regNumber).toBe(data.regNumber);

			// Check the data in the database
			const newCar = await Car.findOne({ _id: response.body.data.result._id });
			expect(newCar).toBeTruthy();
			expect(newCar.description).toBe(data.description);
			expect(newCar.regNumber).toBe(data.regNumber);
		});
});

test('DELETE /v1/ads/cars/:id', async () => {
	const car = await Car.create(obj);

	await supertest(app)
		.delete('/v1/ads/cars/' + car.id)
		.set('Authorization', `Bearer ${userToken}`)
		.expect(200)
		.then(async () => {
			expect(await Car.findOne({ _id: car.id })).toBeFalsy();
		});
});

test('PATCH /v1/ads/cars/add-to-fav/:id', async () => {
	const car = await Car.create(obj);

	await supertest(app)
		.patch(`/v1/ads/cars/add-to-fav/${car.id}`)
		.set('Authorization', `Bearer ${userToken}`)
		.expect(400);
});

test('GET /v1/ads/cars/myCars', async () => {
	const car = await Car.create(obj);

	await supertest(app)
		.get('/v1/ads/cars/myCars')
		.set('Authorization', `Bearer ${userToken}`)
		.expect(200)
		.then(async () => {
			expect(await Car.findOne({ _id: car.id })).toBeTruthy();
		});
});

test('PATCH /v1/ads/cars/mark-sold/:id', async () => {
	const car = await Car.create(obj);

	await supertest(app)
		.patch(`/v1/ads/cars/mark-sold/${car.id}`)
		.set('Authorization', `Bearer ${userToken}`)
		.expect(200)
		.then(async () => {
			expect(await Car.findOne({ _id: car.id, isSold: car.isSold })).toBeFalsy();
		});
});
