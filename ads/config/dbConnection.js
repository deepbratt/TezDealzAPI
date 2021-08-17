const mongoose = require('mongoose');

const db =
  process.env.NODE_ENV === 'production'
    ? process.env.DB_REMOTE
    : process.env.DB_LOCAL;

const dbConnect = async () => {
<<<<<<< HEAD
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('DB Connected Successfuly');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
=======
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
>>>>>>> 419586703548b925832b6dcbfe6e3d867b2f2860
};

module.exports = dbConnect;
