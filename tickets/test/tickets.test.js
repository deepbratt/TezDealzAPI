const app = require('../index');
const Ticket = require('../models/ticket/ticketModel');
const Users = require('../models/user/userModel');
const mongoose = require('mongoose');
const supertest = require('supertest');
const dbName = process.env.DB_LOCAL;

let token;

let assistance1 = {
  email: 'lorum@example.com',
  phone: '+923331234567',
  description: 'lorum ipsum hello there',
};

beforeEach((done) => {
  mongoose.connect(dbName, { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test('It should create Technical Assistance ', async function () {
  await supertest(app)
    .post('/v1/tickets/techAssistance')
    .send(assistance1)
    .then((response) => {
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Operation Successfull');
    });
});
