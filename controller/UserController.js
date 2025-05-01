const User = require("../models/UserModels");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

const signup = async (req, res) => {
  try {
    const { name, email, password,phone } = req.body;
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
      phone,
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
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // user ka ID URL se aayega
    const { name, email, phone, status } = req.body; // updated fields

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone, status },
      { new: true, runValidators: true } // return new updated user and validate fields
    ).select("-password"); // password hide

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Error: ${error} while updating user`,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // user ka ID URL se aayega

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Error: ${error} while deleting user`,
    });
  }
};


module.exports = {
  signup,
  login,
  logout,
  allUsers,
  updateUser,
  deleteUser
};
