require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

// CORS (FIXED)
const allowedOrigins = [
  "http://localhost:5173",
  "https://drama-diary-beryl.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reviews", require("./routes/reviewRoute"));

module.exports = app;