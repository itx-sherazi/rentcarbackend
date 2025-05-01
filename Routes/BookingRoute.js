const express = require('express');
const router = express.Router();
const BookingController = require('../controller/BookingController');

// Get all cars
router.post('/booking', BookingController.Booking);
router.get('/AllBook', BookingController.getBookings);
router.delete("/booking/:id", BookingController.deleteBooking);

module.exports = router;