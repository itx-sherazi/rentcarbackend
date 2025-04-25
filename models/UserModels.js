const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
   
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
