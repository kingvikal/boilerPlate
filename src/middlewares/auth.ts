import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/app-error";
import { ReqUser } from "../utils/reqUser";
import dotenv from "dotenv";

dotenv.config();

export const Auth = async (
  req: ReqUser<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const headers: any = req?.headers?.authorization;

  const token = headers && headers.split(" ")[1];

  if (!token) {
    return next(new AppError(400, "Access denied! No token provided"));
  }

  try {
    const jwtSecret: any = process.env.JWT_SECRET;

    if (token) {
      const decoded: any = jwt.verify(token, jwtSecret);

      if (!decoded) {
        return next(new AppError(400, "Invalid Token"));
      }

      req.user = decoded;
      next();
    }
  } catch (err: any) {
    const accessToken = req.headers["authorization"];
    const refreshToken = req.cookies["refreshToken"];

    if (!accessToken || !refreshToken) {
      return next(new AppError(400, "Access denied. Session Expired"));
    }

    try {
      const token = accessToken && accessToken.split(" ")[1];

      const jwtSecret: any = process.env.JWT_SECRET;
      const jwtRefreshSecret: any = process.env.JWT_REFRESH_SECRET;
      jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) {
          const user = jwt.verify(refreshToken, jwtRefreshSecret);
          if (user) {
            const accessToken = jwt.sign({ payload: user }, jwtSecret, {
              expiresIn: "7d",
            });
            return res.status(200).json({
              message: "JWT expired your new access token is:",
              accessToken: accessToken,
            });
          }
          return res.status(400).json("Invalid token");
        }
        req.user = user;
        next();
      });
    } catch (err: any) {
      console.log({ err });
      return next(new AppError(500, `Internal Server Error : ${err.message}`));
    }
  }
};

export const isAdmin = async (
  req: ReqUser<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!["admin"].includes(req.user?.userType)) {
      return next(new AppError(403, "Unauthorized access. Contact admin"));
    }
    next();
  } catch (err) {
    console.error(err);
    return next(new AppError(500, "Internal Server Error"));
  }
};
