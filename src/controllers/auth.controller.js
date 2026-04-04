const ms = require("ms");

// REGISTER
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// helper: generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ✅ REGISTER (with httpOnly cookie)
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. check existing - არსებული იუზერის შემოწმება
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 2. create user

    const user = await User.create({
      username,
      email,
      password,
    });

    // 3. generate JWT
    //   token = ვიზა
    const token = generateToken(user._id);

    // 4. send httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // CSRF protection
      maxAge: ms(process.env.JWT_EXPIRES_IN), // 🔥 from .env
    });

    // 5. response (NO password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  register,
};

// LOGIN
const login = async (req, res) => {};

module.exports = {
  register,
  login,
};
