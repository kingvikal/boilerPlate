import dotenv from "dotenv";
import { createServer } from "http";
import { app } from "./config/express";
import { AppDataSource } from "./database/postgres";
import { dev } from "./config/config";

dotenv.config();

const server = createServer(app);

server.listen(dev.PORT || 8000, async () => {
  try {
    await AppDataSource.initialize()
      .then(() => {
        console.log("DB connected");
      })
      .catch((err) => console.log({ err }));

    console.log(`🌟 Server is running --- http://localhost:${dev.PORT}`);
  } catch (err) {
    console.log("err", err);
  }
});

process
  .on("unhandledRejection", (reason, promise) => {
    console.error(reason, "Unhandled Rejection at Promise", promise);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });
