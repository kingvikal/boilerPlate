import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

export const generateSignature = async (payload: any) => {
  const jwtSecret: any = process.env.JWT_SECRET;
  const sign = jwt.sign(payload, jwtSecret, {
    expiresIn: "1h",
  });
  return sign;
};

export const generateRefreshToken = async (payload: any) => {
  const jwtRefresh: any = process.env.JWT_REFRESH_SECRET;
  const sign = jwt.sign(payload, jwtRefresh, {
    expiresIn: "7d",
  });
  return sign;
};
