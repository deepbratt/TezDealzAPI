// const {
//   sendVerificationCodetoEmail,
//   sendVerificationCodetoPhone,
//   phoneVerification,
//   emailVerification,
// } = require('./accountVerification');

const { resetPassword, forgotPassword, updatePassword } = require('./passwordController');
const {
  signup,
  isLoggedIn,
  login,
  // signupEmail,
  // signupPhone,
  // loginEmail,
  // loginPhone,
  // continueGoogle,
  // continueFacebook,
  // logout,
  // addUserEmail,
  // addUserPhone,
} = require('./authController');

module.exports = {
  isLoggedIn,
  resetPassword,
  forgotPassword,
  updatePassword,
  signup,
  login,
  // phoneVerification,
  // emailVerification,
  // sendVerificationCodetoEmail,
  // sendVerificationCodetoPhone,
  // signupEmail,
  // signupPhone,
  // loginEmail,
  // loginPhone,
  // continueGoogle,
  // continueFacebook,
  // logout,
  // addUserEmail,
  // addUserPhone,
};
