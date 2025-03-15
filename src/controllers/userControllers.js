const userModels = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECURE_KEY = process.env.SECURE_KEY;

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const signUp = async (req, res) => {
  let { username, email, password } = req.body;

  username = username?.trim();
  email = email?.trim();
  password = password?.trim();

  if (!SECURE_KEY) {
    return res
      .status(500)
      .json({ message: "Server error: missing SECURE_KEY" });
  }

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await userModels.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModels({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      SECURE_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signIn = async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim();
  password = password?.trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await userModels.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECURE_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModels.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signUp, signIn, getAllUsers };
