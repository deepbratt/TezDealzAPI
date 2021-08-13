const express = require('express');
const User = require('../model/userModel');
const { authenticate } = require('@auth/tdb-auth');
const authController = require('../controller/auth/index');
const userController = require('../controller/user/userController');
const {
	signupEmailRules,
	signupPhoneRules,
	continueGoogleRules,
	continueFaceBookRules,
	validationFunction,
} = require('../utils/validations');
const { upload } = require('@utils/tdb_globalutils');

const router = express.Router();

// Google Authentication Route
router.post('/google-auth', continueGoogleRules, validationFunction, authController.continueGoogle);
// Facebook Authentication Route
router.post(
	'/facebook-auth',
	continueFaceBookRules,
	validationFunction,
	authController.continueFacebook
);
//email-phone
router.post('/signup-email', signupEmailRules, validationFunction, authController.signupEmail);
router.post('/signup-phone', signupPhoneRules, validationFunction, authController.signupPhone);
router.post('/login-email', authController.loginEmail);
router.post('/login-phone', authController.loginPhone);

// forgot Password with Email/Phone
router.post('/forgotPassword', authController.forgotPassword);
//Reset Password
router.patch('/resetPassword/:token', authController.resetPassword);
//Send verification email
router.post('/send-verification-email', authController.sendVerificationCodetoEmail);
//Send verification Phone
router.post('/send-verification-phone', authController.sendVerificationCodetoPhone);
//account verification
// router.patch(
//   '/account-verification/:token',
//   authController.accountVerification,
// );

// Phone verification
router.patch('/phone-verification/:token', authController.phoneVerification);

// Email verification
router.patch('/email-verification/:token', authController.emailVerification);

// authenticate route
router.use(authenticate(User));

// Update Current User's Password
router.patch('/updateMyPassword', authController.updatePassword);

// Update Current User's Data
router.patch('/updateMe', upload('image').single('image'), userController.updateMe);

// Delete/Inactive Current User
router.delete('/deleteMe', userController.deleteMe);

// Update Current User's Phone
router.patch('/addMyPhone', authController.addUserPhone);

// Update Current User's  Email
router.patch('/addMyEmail', authController.addUserEmail);

//users
router.route('/currentUser').get(authController.isLoggedIn);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);
module.exports = router;
