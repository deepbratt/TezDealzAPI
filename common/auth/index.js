const { AppError, catchAsync } = require('@utils/tdb_globalutils');
const { ERRORS, STATUS_CODE } = require('@constants/tdb-constants');
const jwt = require('jsonwebtoken');
exports.authenticate = (User) => {
	return catchAsync(async (req, res, next) => {
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
		if (!currentUser.active || currentUser.banned) {
			return next(
				new AppError(
					`Your account is Banned or Inactive, Please contact the customer support`,
					STATUS_CODE.NOT_FOUND
				)
			);
		}
		//check if user changed password after the token was issued
		if (currentUser.changedPasswordAfter(decoded.iat)) {
			return next(new AppError(ERRORS.UNAUTHORIZED.INVALID_JWT, STATUS_CODE.UNAUTHORIZED));
		}
		//Grant access to protected route
		req.user = currentUser;
		next();
	});
};

exports.checkIsLoggedIn = (User) => {
	return async (req, res, next) => {
		//getting token and check is it there
		let token;
		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(' ')[1];
		} else if (req.session.jwt) {
			token = req.session.jwt;
		}
		if (token) {
			try {
				//verification token
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				//check if user sitll exists
				const currentUser = await User.findById(decoded.userdata.id);
				if (!currentUser) {
					return next();
				}
				if (!currentUser.active || currentUser.banned) {
					return next();
				}
				//check if user changed password after the token was issued
				if (currentUser.changedPasswordAfter(decoded.iat)) {
					return next();
				}
				//Grant access to protected route
				req.user = currentUser;
				return next();
			} catch (err) {
				return next();
			}
		}
		next();
	};
};

exports.restrictTo = (...role) => {
	return (req, res, next) => {
		if (!role.includes(req.user.role)) {
			return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
		}
		next();
	};
};
