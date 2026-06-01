require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/reviewRoute");

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

module.exports = app;