// ScooterModel.js
const mongoose = require("mongoose");

const ScooterSchema = new mongoose.Schema({
  name: { type: String },
  imageUrl: String,
  seat: String,
  speed: String,
  engine: String,
  year: String,
});

module.exports = mongoose.models.Scooter || mongoose.model("Scooter", ScooterSchema);
