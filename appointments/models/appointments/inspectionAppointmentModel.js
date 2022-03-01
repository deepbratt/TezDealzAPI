const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  city: String,
  address: String,
});

const AppointmentTimeSchema = mongoose.Schema({
  startTime: String,
  endTime: String,
})

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
      type: LocationSchema,
      required: true,
    },
    inspectionLocation:{
      type: String,
      default: 'carlocation',
      enum: {
        values: ['carlocation', 'dealerlocation'],
        message: 'Please Enter Valid inspection location.',
      },
    },
    firstName: {
      type: String,
      required:true,
    },
    lastName: {
      type: String,
      required:true,
    },
    phone: {
      type: String,
      required:true,
    },
    userAvailability: {
      type: String,
    },
    alternativePhone: {
      type: String,
    },
    appointmentTime: {
      type: AppointmentTimeSchema,
    },
    appointmentDate:{
      type: String,
    },
    appointmentSlot:{
      type:String,
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
