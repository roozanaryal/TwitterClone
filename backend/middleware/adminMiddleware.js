import User from "../models/user.model.js";

export const adminOnly = async (req, res, next) => {
  try {
    // Check if user is authenticated (from authMiddleware)
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - Please login" });
    }

    // Check if user is admin
    const user = await User.findById(req.user._id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Forbidden - Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Error in adminOnly middleware:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
