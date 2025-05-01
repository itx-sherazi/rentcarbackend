const Car = require("../models/CarModel");
const { uploadMedia } = require("../service/cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Get All Car
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCar = async (req, res) => {
  try {
    const { name, seat, category, year, speed, fuel } = req.body;
    const image = req.file.path;
    console.log(req.file.path, "image");
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    } else if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    } else if (!seat) {
      return res.status(400).json({
        success: false,
        message: "Seat is required",
      });
    } else if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    } else if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    } else if (!speed) {
      return res.status(400).json({
        success: false,
        message: "Speed is required",
      });
    } else if (!fuel) {
      return res.status(400).json({
        success: false,
        message: "Fuel type is required",
      });
    }

    const newCar = new Car({
      name,
      seat: Number(seat),
      imageUrl: image,
      category,
      year: Number(year),
      speed,
      fuel,
    });

    await newCar.save();

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car: newCar,
    });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({
      success: false,
      error: "Server error while adding car",
      details: error.message,
    });
  }
};





exports.getCarsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const cars = await Car.find({ category });

    if (cars.length === 0) {
      return res
        .status(404)
        .json({ message: `No cars found in ${category} category` });
    }

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create upload middleware specifically for the image field
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image"); // This is the crucial part - tells Multer to expect a single file with field name 'image'

exports.updateCar = async (req, res) => {
  try {
    // Handle the file upload first
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload error",
        });
      }

      try {
        const { name, seat, category, year, speed, fuel } = req.body;
        const carId = req.params.id;

        const car = await Car.findById(carId);
        if (!car) {
          return res.status(404).json({
            success: false,
            message: "Car not found",
          });
        }

        // Update fields
        if (name !== undefined) car.name = name;
        if (seat !== undefined) car.seat = seat;
        if (category !== undefined) car.category = category;
        if (year !== undefined) car.year = year;
        if (speed !== undefined) car.speed = speed;
        if (fuel !== undefined) car.fuel = fuel;

        // Handle image upload if new image provided
        if (req.file) {
          const uploadResponse = await uploadMedia(req.file.path);
          if (!uploadResponse?.secure_url) {
            return res.status(500).json({
              success: false,
              message: "Image upload failed",
            });
          }
          car.imageUrl = uploadResponse.secure_url;

          // Clean up the temporary file
          fs.unlinkSync(req.file.path);
        }

        await car.save();

        res.status(200).json({
          success: true,
          message: "Car updated successfully",
          car,
        });
      } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).json({
          success: false,
          message: "Server error while updating car",
          details: error.message,
        });
      }
    });
  } catch (error) {
    console.error("Error in update car middleware:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
