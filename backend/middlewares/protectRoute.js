import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  console.log('protectRoute: incoming headers', req.headers);

  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log('protectRoute: found token', token);
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "a2b8f4e7c1d9a6b3f5c8e2a1b4d7f9c0a3e6d1b8c5f7a9e2d4b1c8a0f3e5d7c9"
    );
    console.log('protectRoute: decoded JWT', decoded);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    req.user = user;
    console.log("req.user set by protectRoute:", req.user);
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export default protectRoute;