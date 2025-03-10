const userModels = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECURE_KEY = process.env.SECURE_KEY;

const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existinUser = await userModels.findOne({ email: email });
    if (existinUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hassedPassword = bcrypt.hashSync(password, 10);

    const newUser = await new userModels({
      email: email,
      password: hassedPassword,
      username: username,
    });

    await newUser.save(); // Save's the user to the database, this line is very important.

    const token = jwt.sign(
      {
        email: newUser.email,
        id: newUser._id,
      },
      SECURE_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User Created Successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModels.findOne({ email: email });
    console.log("existingUser: ", existingUser);
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const matchPassWord = await bcrypt.compare(password, existingUser.password);
    if (!matchPassWord) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      SECURE_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User Logged In Successfully",
      user: existingUser,
      token: token,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signUp, signIn };
