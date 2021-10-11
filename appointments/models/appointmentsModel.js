const mongoose = require('mongoose');

const appointmentsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide First Name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide Last Name'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide Phone Number'],
    },
    status: {
      type: String,
      default: 'Pending',
      enum: {
        values: ['Pending', 'In-Progress', 'Rejected', 'Approved'],
        message: 'Please Enter Valid Status',
      },
    },
  },
  {
    timestamps: true,
  },
);

const Appointments = mongoose.model('Appointments', appointmentsSchema);

module.exports = Appointments;
