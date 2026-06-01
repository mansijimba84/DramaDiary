const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const getUser = await User.findOne({ email });
    if (!getUser)
      return res
        .status(403)
        .json({ success: false, message: "User not found" });

    const passwordCheck = await bcrypt.compare(password, getUser.password);
    if (!passwordCheck)
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials" });

    const payload = {
      _id: getUser._id,
      email: getUser.email,
      role: getUser.role,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });

    const { password: pwd, ...userWithoutPassword } = getUser.toObject();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
