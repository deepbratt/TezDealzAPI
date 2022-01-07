const mongoose = require('mongoose');

const db = process.env.NODE_ENV === 'production' ? process.env.DB_PROD : process.env.DB_REMOTE;
// console.log(process.env.NODE_ENV);
// console.log(process.env.DB_REMOTE);
const dbConnect = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true,
    });
    console.log('DB Connected Successfuly');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = dbConnect;
