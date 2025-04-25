const express = require("express");
const connectDB = require("./database/db.js");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/UserRoute.js");
const morgan = require("morgan");

const app = express();

dotenv.config({});

// Database
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
    "https://rentcar-beryl.vercel.app/"
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/user", userRouter);

// Only listen when running locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;
