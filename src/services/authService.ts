import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateSignature } from "../utils/function";
import AppError from "../utils/app-error";
import { sendMail } from "../utils/mailservice";

export const SignUp = async (payload: any) => {
  const { firstname, lastname, age, city, email, password, status, userType } =
    payload;

  const hashedPassword = bcrypt.hashSync(password, 12);

  const userCreate = new User();
  userCreate.firstname = firstname;
  userCreate.lastname = lastname;
  userCreate.age = age;
  userCreate.city = city;
  userCreate.email = email;
  userCreate.status = status;
  userCreate.userType = userType;
  userCreate.password = hashedPassword;

  const saveUser = await User.save(userCreate);

  return { user: saveUser };
};

export const SignIn = async (payload: any) => {
  const { email, password } = payload;

  const user: any = await User.findOne({
    where: { email: email },
  });

  const userType = user?.userType;
  const userId = user?.id;

  if (!user) {
    throw new AppError(400, "User doesn't exist with this email");
  }

  const accessToken = await generateSignature({
    email,
    userType,
    userId,
  });
  const refreshToken = await generateRefreshToken({
    email,
    userType,
    userId,
  });
  const passwordCompare = bcrypt.compareSync(password, user.password);

  return { user, accessToken, refreshToken, passwordCompare };
};

export const ForgetPassword = async (payload: any) => {
  const { email } = payload;
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    throw new AppError(400, "User not found");
  }
  const object = [user.id, user.email, user.userType];
  const jwtSecret: any = process.env.JWT_SECRET;
  const token = jwt.sign({ object }, jwtSecret, { expiresIn: "5m" });

  return { user, token };
};

export const ResetPassword = async (
  payload: { newPassword: string },
  token: string
) => {
  const { newPassword } = payload;

  const hashedPassword = bcrypt.hashSync(newPassword, 12);

  const jwtSecret: any = process.env.JWT_SECRET;

  const decoded: any = jwt.verify(token, jwtSecret);

  const user = await User.findOne({ where: { id: decoded.userId } });

  if (user) {
    user.password = hashedPassword;

    await user.save();
  }
  return { user };
};

export const ChangePassword = async (payload: {
  email: string;
  newPassword: string;
  oldPassword: string;
}) => {
  const { oldPassword, newPassword, email } = payload;

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    throw new AppError(400, "User not found");
  }

  const comparePassword = bcrypt.compareSync(oldPassword, user.password);

  if (!comparePassword) {
    throw new AppError(400, "password doesn't match");
  }
  const compare = bcrypt.compareSync(newPassword, user.password);
  if (compare) {
    throw new AppError(400, "Same password as old one");
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 12);

  user.password = hashedPassword;
  await user.save();
};
