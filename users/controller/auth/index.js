const {
  sendVerificationCodetoEmail,
  sendVerificationCodetoPhone,
  phoneVerification,
  emailVerification,
} = require('./accountVerification');

const {
  resetPassword,
  forgotPassword,
  updatePassword,
} = require('./passwordController');
const {
  signupEmail,
  signupPhone,
  loginEmail,
  loginPhone,
  continueGoogle,
  continueFacebook,
  isLoggedIn,
  logout,
  addUserEmail,
  addUserPhone,
} = require('./authController');

module.exports = {
  phoneVerification,
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
  addUserEmail,
  addUserPhone,
};
