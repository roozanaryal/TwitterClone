import User from "../models/user.model.js";

export const searchResult = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      name: { $regex: "^" + q, $options: "i" },
    }).limit(5);
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
