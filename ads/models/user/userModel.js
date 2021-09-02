const mongoose = require('mongoose');
const validator = require('validator');
const { ERRORS } = require('@constants/tdb-constants');

const userSchema = new mongoose.Schema({
	facebookId: {
		type: String,
	},
	googleId: {
		type: String,
	},
	displayName: {
		type: String,
	},
	firstName: {
		type: String,
		minlength: 3,
		maxlength: 15,
		required: [true, ERRORS.REQUIRED.FIRSTNAME_REQUIRED],
		// validate: [validator.isAlpha, ERRORS.INVALID.INVALID_FIRSTNAME],
	},
	middleName: {
		type: String,
	},
	lastName: {
		type: String,
		minlength: 3,
		maxlength: 15,
		required: [true, ERRORS.REQUIRED.LASTNAME_REQUIRED],
		validate: [validator.isAlpha, ERRORS.INVALID.INVALID_LASTNAME],
	},
	email: {
		type: String,
		lowercase: true,
		validate: [validator.isEmail, ERRORS.INVALID.INVALID_EMAIL],
	},
	phone: {
		type: String,
		validate: [validator.isMobilePhone, ERRORS.INVALID.INVALID_PHONE_NUM],
	},
	password: {
		type: String,
		minlength: [8, ERRORS.INVALID.PASSWORD_LENGTH],
		select: false,
	},
	image: {
		type: String,
	},
	accountVeificationToken: {
		type: String,
		select: false,
	},
	verificationTokenExpires: {
		type: Date,
		select: false,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	passwordResetToken: {
		type: String,
		select: false,
	},
	passwordResetExpires: {
		type: Date,
		select: false,
	},
	passwordChangedAt: Date,
});

//CHANGED_PASSWORD_AFTER
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
