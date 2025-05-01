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
    phone:{
    required:true,
    type:Number
    },
    password: {
      required: true,
      type: String,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],  // sirf "Active" ya "Inactive" allowed
      default: 'Active',             // yahan default set hai!
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
