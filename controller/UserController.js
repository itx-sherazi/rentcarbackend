const User = require("../models/UserModels");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
     name,
      email,
      password: hashedPassword,
    });
    return res
      .status(200)
      .json({ success: true, message: "User created successfully", newUser });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Error : ${error} while creating user`,
    });
  }
};

//User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        error: "Invalid email or password",
      });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Error : ${error} while login attempt`,
    });
  }
};

//User Logout
const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      error: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Error : ${error} while logout attempt`,
    });
  }
};

//Get All Users
const allUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (users) {
      res.status(200).json({
        success: true,
        users,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Error : ${error} while getting users`,
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  allUsers,
};
