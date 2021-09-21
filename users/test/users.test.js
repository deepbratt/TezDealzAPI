const app = require('../index');
const Users = require('../model/userModel');
const mongoose = require('mongoose');
const supertest = require('supertest');
const dbName = process.env.DB_LOCAL;

let token;

let user1 = {
  firstName: 'lorum',
  lastName: 'ipsum',
  data: 'lorum@example1.com',
  role: 'User',
  username: 'lorum1',
  password: 'lorum1234',
  passwordConfirm: 'lorum1234',
};

let newUser = {
  firstName: 'lorum',
  lastName: 'ipsum',
  data: 'lorum@example.com',
  role: 'Admin',
  username: 'lorum123',
  password: 'lorum1234',
  passwordConfirm: 'lorum1234',
};

beforeEach((done) => {
  mongoose.connect(dbName, { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});

beforeEach((done) => {
  supertest(app)
    .post('/v1/users/signup')
    .send(newUser)
    .end((err, response) => {
      done();
    });
});

beforeEach((done) => {
  supertest(app)
    .post('/v1/users/admin-panel-login')
    .send({
      data: newUser.data,
      password: newUser.password,
    })
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test('Admin can create new User ', async function () {
  await supertest(app)
    .post('/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .send(user1)
    .then((response) => {
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Created Successfully');
    });
});

test('Admin Panel Login', async function () {
  await supertest(app)
    .post('/v1/users/admin-panel-login')
    .send({
      data: newUser.data,
      password: newUser.password,
    })
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Operation Successfull');
    });
});

test('It should allow Admin to get one user by ID ', async function () {
  const user = await Users.create(user1);
  await supertest(app)
    .get('/v1/users/' + user._id)
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Operation Successfull');
    });
});

test('It should allow Admin to delete one user ', async function () {
  const user = await Users.create(user1);
  await supertest(app)
    .delete('/v1/users/' + user._id)
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('User Deleted Successfully');
    });
});

test('It should Allow Admin to get all users data', async function () {
  await supertest(app)
    .get('/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Operation Successfull');
    });
});

test('It should Allow Admin to check all users stats', async function () {
  await supertest(app)
    .get('/v1/users/stats')
    .set('Authorization', `Bearer ${token}`)
    .then((response) => {
      expect(response.statusCode).toBe(200);
    });
});

test('It should return data of current user', async function () {
  await supertest(app)
    .get('/v1/users/currentUser')
    .set('Authorization', `Bearer ${token}`)
    .then((response) => {
      expect(response.statusCode).toBe(200);
    });
});

test('It should Allow Admin to update current user data', async function () {
  await supertest(app)
    .patch('/v1/users/updateMe')
    .set('Authorization', `Bearer ${token}`)
    .send({ city: 'Lahore' })
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Your Profile has been updated Successfully');
    });
});

test('It should  update current user password', async function () {
  await supertest(app)
    .patch('/v1/users/updateMyPassword')
    .set('Authorization', `Bearer ${token}`)
    .send({ passwordCurrent: 'lorum1234', password: 'lorum1234', passwordConfirm: 'lorum1234' })
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Operation Successfull');
    });
});

test('Admin can updated user Password', async function () {
  const user = await Users.create(user1);
  await supertest(app)
    .patch('/v1/users/updateUserPassword/' + user._id)
    .set('Authorization', `Bearer ${token}`)
    .send({
      password: 'lorum123',
      passwordConfirm: 'lorum123',
    })
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Password changed successfully');
    });
});

test('Admin can updated user data', async function () {
  const user = await Users.create(user1);
  await supertest(app)
    .patch('/v1/users/' + user._id)
    .set('Authorization', `Bearer ${token}`)
    .send({
      city: 'Lahore',
      country: 'Pakistan',
    })
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Your Profile has been updated Successfully');
    });
});

test('Admin can inactive user by id', async function () {
  const user = await Users.create(user1);
  await supertest(app)
    .patch('/v1/users/inactive-user/' + user._id)
    .set('Authorization', `Bearer ${token}`)
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('User has been Inactivted successfully');
    });
});

test('Admin can active user by id', async function () {
  const user = await Users.create(user1);
  await supertest(app)
    .patch('/v1/users/active-user/' + user._id)
    .set('Authorization', `Bearer ${token}`)
    .send({ active: true })
    .then((response) => {
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('User is already Active or does not exist');
    });
});

test('Admin can ban user by id', async function () {
  const user = await Users.create(user1);
  await supertest(app)
    .patch('/v1/users/ban-user/' + user._id)
    .set('Authorization', `Bearer ${token}`)
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('You have Successfully banned this User');
    });
});

test('Admin can Unban user by id', async function () {
  const user = await Users.create(user1);
  await supertest(app)
    .patch('/v1/users/unban-user/' + user._id)
    .set('Authorization', `Bearer ${token}`)
    .send({ banned: false })
    .then((response) => {
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('This User is already Unban or Does not Exist');
    });
});

test('It should inactive current user', async function () {
  await supertest(app)
    .delete('/v1/users/deleteMe')
    .set('Authorization', `Bearer ${token}`)
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('User Deleted Successfully');
    });
});

test('It should send token to email or phone', async function () {
  await Users.create(user1);
  supertest(app)
    .post('/v1/users/forgotPassword')
    .send({
      data: user1.data,
    })
    .then((response) => {
      expect(response.statusCode).toBe(200);
    });
});
