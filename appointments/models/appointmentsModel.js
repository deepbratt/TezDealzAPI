const mongoose = require('mongoose');

const appointmentsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
      enum: {
        values: ['Pending', 'In-Progress', 'Rejected', 'Approved'],
        message: 'Please Enter Valid Status',
      },
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Appointments = mongoose.model('Appointments', appointmentsSchema);

module.exports = Appointments;
