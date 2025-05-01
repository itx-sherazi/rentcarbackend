const jwt = require("jsonwebtoken");
const generateToken = (res, user, message) => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "5d",
    }
  );
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 5 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      user,
    });
};

module.exports = generateToken;
