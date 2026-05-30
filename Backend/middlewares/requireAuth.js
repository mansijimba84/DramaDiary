const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function authenticateUser(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // full user available in controllers
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
