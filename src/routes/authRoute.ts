import { Router } from "express";
import {
  Login,
  Register,
  changePassword,
  forgetPassword,
  resetPassword,
} from "../controllers/authController";
import { Auth } from "../middlewares/auth";

const route = Router();

route.post("/register", Register);
route.post("/login", Login);
route.post("/forget-pass", forgetPassword);
route.post("/change-pass", Auth, changePassword);
route.put("/reset-pass/:token", resetPassword);

export default route;
