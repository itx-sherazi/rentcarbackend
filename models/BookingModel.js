// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  carId: { type: String, required: true },
  carName:{type: String},
  carImage:{type: String},
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  driverLicense: { type: String, required: true },
  address: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  returnLocation: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  agreeToTerms: { type: Boolean, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
