import { Request, Response, NextFunction, response } from "express";
import AppError from "../utils/app-error";
import {
  DeleteUser,
  GetUserById,
  GetUsers,
  UpdateUser,
} from "../services/userService";
import { User } from "../models/userModel";

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    const result = await GetUserById(id);

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    return next(new AppError(500, "Internal Server Error"));
  }
};

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.body.page || 1;
    const limit = req.body.limit || 20;
    const search = req.body.search || null;

    const data = await GetUsers({ limit, page, search });
    console.log(data);

    res.status(200).json({ data: data.user, totalPages: data.totalPages });
  } catch (err) {
    console.error(err);
    return next(new AppError(500, "Internal Server Error"));
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id }: any = req.params;
    const payload = req.body;

    const findEmail = await User.findOne({ where: { email: req.body.email } });
    if (findEmail) {
      return next(
        new AppError(400, `${findEmail.email} already taken! Enter new one`)
      );
    }

    const result = await UpdateUser(id, payload);

    if (result === null) {
      return next(new AppError(400, "Cannot update or already updated"));
    }
    return res
      .status(200)
      .json({ message: "User updated Successfully", data: result });
  } catch (err: any) {
    console.log(err);
    return next(new AppError(500, `Internal Error in: ${err.message}`));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await DeleteUser(id);

    if (result.affected === 0) {
      return next(new AppError(400, "Cannot delete or already deleted"));
    }

    return res.status(200).json({ message: `User Deleted Successfully` });
  } catch (err: any) {
    console.log(err);
    return next(
      new AppError(500, `Internal Server Error. err: ${err.message}`)
    );
  }
};
