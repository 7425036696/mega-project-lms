const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user.route");
const ErrorHandler = require("./utils/ErrorHandler");

const app = express();
module.exports = app;

// ----------------- MIDDLEWARE -----------------
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}));

// ----------------- ROUTES -----------------
app.use("/app/v1", userRouter);

app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working"
  });
});

// ----------------- 404 HANDLER -----------------
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error); // This sends it to the error handler
});

// ----------------- GLOBAL ERROR HANDLER -----------------
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message
  });
});
