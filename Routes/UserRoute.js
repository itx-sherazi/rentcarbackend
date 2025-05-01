const express = require("express");
const {
  signup,
  login,
  logout,
  allUsers,
  updateUser,
  deleteUser
} = require("../controller/UserController");

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/all-users", allUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
