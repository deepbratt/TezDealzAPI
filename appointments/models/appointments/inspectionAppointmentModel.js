const mongoose = require('mongoose');

const appointmentsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    ad_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Car',
    },
    carLocation: {
      type: String,
      required: true,
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
    userAvailability: {
      type: String,
    },
    alternativePhone: {
      type: String,
    },
    appointmentTime: {
      type: String,
    },
    mechanicAssigned: {
      type: Boolean,
      default: false,
    },
    mechanicName: {
      type: String,
    },
    mechanicPhone: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
      enum: {
        values: ['Pending', 'In-Progress', 'mechanic_assigned', 'report_generated', 'Rejected'],
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
