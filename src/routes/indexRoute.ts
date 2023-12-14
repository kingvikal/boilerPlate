import { Router } from "express";
import authRoute from "../routes/authRoute";
import userRoute from "../routes/userRoute";

const route = Router();

route.use("/auth", authRoute);
route.use("/user", userRoute);

export default route;
