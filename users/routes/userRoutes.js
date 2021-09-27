const express = require('express');
const User = require('../model/userModel');
const { authenticate, restrictTo } = require('@auth/tdb-auth');
const authController = require('../controller/auth/index');
const userController = require('../controller/user/userController');
const adminController = require('../controller/admin/adminController');

const {
  changePassword,
  validationFunction,
  signupRules,
  addUser,
  //   signupEmailRules,
  //   signupPhoneRules,
  //   continueGoogleRules,
  //   continueFaceBookRules,
} = require('../utils/validations');
const { upload } = require('@utils/tdb_globalutils');

const router = express.Router();
router.post('/signup', signupRules, validationFunction, authController.signup);
router.post('/login', authController.login);
router.post('/admin-panel-login', authController.adminPanellogin);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/forgot-password-admin', adminController.forgotPasswordAdmin);

router.patch(
  '/resetPassword/:token',
  changePassword,
  validationFunction,
  authController.resetPassword,
);

router.patch(
  '/reset-password-admin/:token',
  changePassword,
  validationFunction,
  adminController.resetPasswordAdmin,
);
// authenticate route
router.use(authenticate(User));

// Add User, Moderators or Admins by Admin
router.post('/create-user', restrictTo('Admin', 'Moderator'), adminController.createUser);

// Update Current User's Password
router.patch('/updateMyPassword', validationFunction, authController.updatePassword);

// Update Current User's Data
router.patch('/updateMe', upload('image').single('image'), userController.updateMe);

// Delete/Inactive Current User
router.delete('/deleteMe', userController.deleteMe);

// Active User
router.patch('/active-user/:id', restrictTo('Admin', 'Moderator'), adminController.activeUser);

// inctive User
router.patch('/inactive-user/:id', restrictTo('Admin', 'Moderator'), adminController.inactiveUser);

// Ban User By Admin
router.patch('/ban-user/:id', restrictTo('Admin', 'Moderator'), adminController.banUser);

// unBan User By Admin
router.patch('/unban-user/:id', restrictTo('Admin', 'Moderator'), adminController.unbanUser);

//users
router.route('/currentUser').get(authController.isLoggedIn);

// Statistcs of Users
router.route('/stats').get(restrictTo('Admin', 'Moderator'), adminController.userStats);
router
  .route('/daily-stats/:min/:max')
  .get(restrictTo('Admin', 'Moderator'), adminController.dailyUserAggregate);

// Only accessibe by Admin and Moderator
router.use(restrictTo('Admin', 'Moderator'));

router
  .route('/')
  .get(adminController.getAllUsers)
  .post(addUser, validationFunction, adminController.createUser);
router
  .route('/:id')
  .get(adminController.getUser)
  .patch(upload('image').single('image'), adminController.updateUserProfile)
  .delete(adminController.deleteUser);
router
  .route('/updateUserPassword/:id')
  .patch(changePassword, validationFunction, adminController.updatePassword);

// Google Authentication Route
// router.post('/google-auth', continueGoogleRules, validationFunction, authController.continueGoogle);
// Facebook Authentication Route
// router.post(
// 	'/facebook-auth',
// 	continueFaceBookRules,
// 	validationFunction,
// 	authController.continueFacebook
// );
//email-phone
// router.post('/signup-email', signupEmailRules, validationFunction, authController.signupEmail);
// router.post('/signup-phone', signupPhoneRules, validationFunction, authController.signupPhone);
// router.post('/login-email', authController.loginEmail);
// router.post('/login-phone', authController.loginPhone);

//Send verification email
// router.post('/send-verification-email', authController.sendVerificationCodetoEmail);
//Send verification Phone
// router.post('/send-verification-phone', authController.sendVerificationCodetoPhone);
//account verification
// router.patch(
//   '/account-verification/:token',
//   authController.accountVerification,
// );

// Phone verification
// router.patch('/phone-verification/:token', authController.phoneVerification);

// Email verification
// router.patch('/email-verification/:token', authController.emailVerification);

// Update Current User's Phone
// router.patch('/addMyPhone', authController.addUserPhone);

// Update Current User's  Email
// router.patch('/addMyEmail', authController.addUserEmail);

module.exports = router;
