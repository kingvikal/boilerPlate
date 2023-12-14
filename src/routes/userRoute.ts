import { Router } from "express";
import { Auth } from "../middlewares/auth";
import {
  deleteUser,
  getAllUser,
  getUserById,
  updateUser,
} from "../controllers/userController";

const route = Router();

route.get("/:id", Auth, getUserById);
route.get("/", Auth, getAllUser);
route.put("/:id", Auth, updateUser);
route.delete("/:id", Auth, deleteUser);

export default route;
