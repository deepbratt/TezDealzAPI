const mongoose = require('mongoose');
// const { MongooseQueryLogger } = require('mongoose-query-logger');

const db = process.env.NODE_ENV === 'production' ? process.env.DB_REMOTE : process.env.DB_LOCAL;
// console.log(db);

const dbConnect = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: true,
    });
    console.log('DB Connected Successfuly');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = dbConnect;
