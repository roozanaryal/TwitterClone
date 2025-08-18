import User from "../models/user.model";

export const searchResult = async () => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      name: { $regex: "^" + q, $options: "i" },
    }).limit(5);
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
