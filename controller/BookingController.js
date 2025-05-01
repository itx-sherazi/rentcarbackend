const Booking = require("../models/BookingModel");
exports.Booking = (req, res) => {
  const {
    carId,
    carName,
    carImage,
    fullName,
    email,
    phone,
    driverLicense,
    address,
    pickupDate,
    returnDate,
    pickupLocation,
    returnLocation,
    paymentMethod,
    agreeToTerms,
  } = req.body;

  if (
    !carId ||
    !fullName ||
    !email ||
    !phone ||
    !driverLicense ||
    !address ||
    !pickupDate ||
    !returnDate ||
    !pickupLocation ||
    !returnLocation ||
    !paymentMethod ||
    agreeToTerms === undefined
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!carName) {
    return res.status(400).json({ message: "Car name is required" });
  }
  if (!carImage) {
    return res.status(400).json({ message: "Car image is required" });
  }
  const newBooking = new Booking({
    carId,
    carName,
    carImage,
    fullName,
    email,
    phone,
    driverLicense,
    address,
    pickupDate,
    returnDate,
    pickupLocation,
    returnLocation,
    paymentMethod,
    agreeToTerms,
  });

  newBooking
    .save()
    .then(() =>
      res.status(201).json({ message: "Booking created successfully" })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error creating booking", error: err.message })
    );
};
// New function to get all bookings
exports.getBookings = (req, res) => {
  Booking.find() // Fetch all bookings from the database
    .then((bookings) => {
      res.status(200).json(bookings); // Return the bookings as JSON
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching bookings", error: err.message });
    });
};
// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err); // Yeh console dekhna error kya aa raha hai
    return res
      .status(500)
      .json({ message: "Error deleting booking", error: err.message });
  }
};
