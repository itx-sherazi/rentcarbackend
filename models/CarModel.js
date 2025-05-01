const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["suv", "Hatchback", "Citadian"],
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/250",
    },
    seat:{
      // type: mongoose.Schema.Types.Mixed,  // Can accept both number and string
type:Number,

      required: true,
    },

    year: {
      type: Number,
      required: true,
    },
    speed: {
      type: String,
      enum: ["Automatic", "Manual","Transmission"],
      required: true,
    },
    fuel:{
      type: String,
      enum: ["Petrol", "Diesel", "Gasoline"],
      required: true,
    }

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", carSchema);
