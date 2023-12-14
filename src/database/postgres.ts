import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { dev } from "../config/config";
import { User } from "../models/userModel";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dev.DB_HOST,
  port: +dev.DB_PORT!,
  username: dev.DB_USER,
  password: dev.DB_PASS,
  database: dev.DB_NAME,
  entities: [User],
  synchronize: true,
});
