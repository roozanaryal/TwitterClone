import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET || "klafsndfink43kjfanw484knf4c8",
    {
      expiresIn: "15d",
    }
  );
  return token;
};
