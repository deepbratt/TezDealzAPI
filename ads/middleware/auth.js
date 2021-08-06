// const axios = require('axios');
// const { catchAsync, AppError } = require('@utils/tdb_globalutils');
// const { srv_url } = require('../constants/consts');
// const { STATUS_CODE } = require('@constants/tdb-constants');
// const auth = async (req, res, next) => {
// 	try {
// 		const response = await await axios({
// 			method: 'POST',
// 			url: `${srv_url.user}/v1/users/isLoggedin`,
// 			headers: { Authorization: `Bearer ${req.session.jwt}` },
// 		});
// 		if (response.status === STATUS_CODE.OK) {
// 			req.user = response.data.user;
// 			console.log(response);
// 		}
// 	} catch (err) {
// 		return next(new AppError(err.response.data.message, err.response.status));
// 	}
// 	next();
// };

const User = require('../models/userModel');
const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS_CODE } = require('@constants/tdb-constants');
const jwt = require('jsonwebtoken');
const auth = catchAsync(async (req, res, next) => {
	//getting token and check is it there
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.session.jwt) {
		token = req.session.jwt;
	}
	if (!token) {
		return next(new AppError(ERRORS.UNAUTHORIZED.NOT_LOGGED_IN, STATUS_CODE.UNAUTHORIZED));
	}
	//verification token
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	//check if user sitll exists
	const currentUser = await User.findById(decoded.userdata.id);
	if (!currentUser) {
		return next(new AppError(`User ${ERRORS.INVALID.NOT_FOUND}`, STATUS_CODE.NOT_FOUND));
	}
	// //check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError(ERRORS.UNAUTHORIZED.INVALID_JWT, STATUS_CODE.UNAUTHORIZED));
	}
	//Grant access to protected route
	req.user = currentUser;
	next();
});

module.exports = auth;

