import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import indexRoute from "../routes/indexRoute";
import AppError from "../utils/app-error";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

export const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

app.use(morgan("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", indexRoute);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(error?.statusCode || 500).json({
    status: error?.status || "error",
    statusCode: error?.statusCode,
    message: error?.message || "Internal Server Error",
  });
});
