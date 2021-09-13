const mongoose = require('mongoose');
const validator = require('validator');
const { ERRORS } = require('@constants/tdb-constants');

const ticketSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
		email: {
			type: String,
			lowercase: true,
			validate: [validator.isEmail, ERRORS.INVALID.INVALID_SIGNUP_CREDENTIALS],
		},
		phone: {
			type: String,
			validate: [validator.isMobilePhone, ERRORS.INVALID.INVALID_SIGNUP_CREDENTIALS],
		},
		type: {
			type: String,
			enum: {
				values: ['Technical Assistance', 'Advertisement Assistance'],
			},
			message: 'Enter Valid Assistance',
		},
		description: {
			type: String,
		},
		status: {
			type: String,
			default: 'opened',
			enum: {
				values: ['opened', 'closed'],
			},
			message: 'Invalid Status',
		},
		closedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
