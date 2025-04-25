const express = require("express");
const {
  signup,
  login,
  logout,
  allUsers,
} = require("../controller/UserController");

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/all-users", allUsers);

module.exports = router;
