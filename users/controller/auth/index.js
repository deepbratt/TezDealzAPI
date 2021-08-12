const {
	sendVerificationCodetoEmail,
	sendVerificationCodetoPhone,
	phonetVerification,
	emailVerification,
} = require('./accountVerification');
const { resetPassword, forgotPassword, updatePassword } = require('./passwordController');
const {
	signupEmail,
	signupPhone,
	loginEmail,
	loginPhone,
	continueGoogle,
	continueFacebook,
	isLoggedIn,
	logout,
} = require('./authController');

module.exports = {
	phonetVerification,
	emailVerification,
	sendVerificationCodetoEmail,
	sendVerificationCodetoPhone,
	resetPassword,
	forgotPassword,
	signupEmail,
	signupPhone,
	loginEmail,
	loginPhone,
	continueGoogle,
	continueFacebook,
	isLoggedIn,
	logout,
	updatePassword,
};
