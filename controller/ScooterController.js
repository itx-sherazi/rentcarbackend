const Scooter = require("../models/ScooterModel");

const { uploadMedia } = require("../service/cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Get All Car
exports.getAllScooter = async (req, res) => {
  try {
    const scooter = await Scooter.find();
    if (!scooter) {
      return res.status(404).json({ message: "scooter not found" });
    }
    res.status(200).json(scooter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addScooter = async (req, res) => {
  try {
    const { name, seat, year, speed, engine } = req.body;
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
    } else if (!engine) {
      return res.status(400).json({
        success: false,
        message: "engine is required",
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
    }

    const newScooter = new Scooter({
      name,
      seat: Number(seat),
      imageUrl: image,
      year: Number(year),
      speed,
      engine,
    });

    await newScooter.save();

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      scooter: newScooter,
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

// Get car by ID
exports.getScooterById = async (req, res) => {
  try {
    const scooter = await Scooter.findById(req.params.id);

    if (!scooter) {
      return res.status(404).json({ message: "scooter not found" });
    }

    res.status(200).json(scooter);
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

exports.updateScooter = async (req, res) => {
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
        const { name, seat, year, speed, engine } = req.body;
        const ScooterId = req.params.id;

        const scooter = await Scooter.findById(ScooterId);
        if (!scooter) {
          return res.status(404).json({
            success: false,
            message: "scooter not found",
          });
        }

        // Update fields
        if (name !== undefined) scooter.name = name;
        if (seat !== undefined) scooter.seat = Number(seat);
        if (year !== undefined) scooter.year = Number(year);
        if (speed !== undefined) scooter.speed = speed;
        if (engine !== undefined) scooter.engine = engine;

        // Handle image upload if new image provided
        if (req.file) {
          const uploadResponse = await uploadMedia(req.file.path);
          if (!uploadResponse?.secure_url) {
            return res.status(500).json({
              success: false,
              message: "Image upload failed",
            });
          }
          scooter.imageUrl = uploadResponse.secure_url;

          // Clean up the temporary file
          fs.unlinkSync(req.file.path);
        }

        await scooter.save();

        res.status(200).json({
          success: true,
          message: "Scooter updated successfully",
          scooter,
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
exports.deleteScooter = async (req, res) => {
  try {
    const scooter = await Scooter.findByIdAndDelete(req.params.id);

    if (!scooter) {
      return res.status(404).json({ message: "scooter not found" });
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
