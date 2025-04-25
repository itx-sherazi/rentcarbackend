const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_URI);
    console.log("Database connection established");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
