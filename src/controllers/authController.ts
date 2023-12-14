import { NextFunction, Request, Response } from "express";
import {
  ChangePassword,
  ForgetPassword,
  ResetPassword,
  SignIn,
  SignUp,
} from "../services/authService";
import { User } from "../models/userModel";
import AppError from "../utils/app-error";
import { sendMail } from "../utils/mailservice";
import { ReqUser } from "../utils/reqUser";

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    const findEmail: any = await User.findOne({
      where: { email: req.body.email },
    });

    if (findEmail) {
      return next(
        new AppError(
          400,
          `${findEmail.email} already exists. Choose another one`
        )
      );
    }
    const result = await SignUp(payload);

    return res.status(201).json({
      message: "User created Successfully",
      user: result.user,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Internal Error in Register"));
  }
};

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const result = await SignIn(payload);

    if (!result.passwordCompare) {
      return next(new AppError(400, "Password doesn't match"));
    }

    if (result.user === null) {
      return next(new AppError(400, "User doesn't exist with this email"));
    }

    return res
      .status(200)
      .cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "none",
      })
      .header("Authorization", result.accessToken)
      .json({
        message: "Login Successful",
        accessToken: result.accessToken,
      });
  } catch (err: any) {
    console.log(err);
    if (err instanceof AppError) {
      return next(new AppError(400, "User doesn't exist with this email"));
    }
    return next(new AppError(500, `Internal Error in Login: ${err.message}`));
  }
};

export const forgetPassword = async (
  req: ReqUser<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const host = req.headers.host;

    console.log(host);

    const result = await ForgetPassword(payload);

    await sendMail(result.user.email, result.token, host).then((done) => {
      if (done) {
        return res.status(200).json({
          message: `Reset link has been sent to ${result.user.email}`,
        });
      }
    });
  } catch (err: any) {
    console.log(err);
    return next(
      new AppError(500, `Internal server error. message: ${err.message}`)
    );
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const { token } = req.params;

    const result = await ResetPassword(payload, token);

    if (result.user === null) {
      throw next(new AppError(400, "User not found"));
    }

    return res
      .status(200)
      .json({ message: "Password updated. Login with new password" });
  } catch (err: any) {
    console.log(err);
    return next(
      new AppError(500, `Internal server error. message: ${err.message}`)
    );
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    await ChangePassword(payload);

    // if(!result){
    //   return next(new AppError(400, ""))
    // }

    return res.status(200).json({
      message: `password changed successfully for user`,
    });
  } catch (err: any) {
    console.log(err);
    if (err instanceof AppError) {
      return res.status(400).json({ message: err.message });
    }
    return next(
      new AppError(500, `Internal server error. message: ${err.message}`)
    );
  }
};
