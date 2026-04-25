const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. get token from cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // 2. verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. attach user to request (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

module.exports = { protect };
