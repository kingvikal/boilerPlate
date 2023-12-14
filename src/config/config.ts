import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

if (process.env.NODE_ENV !== "prod") {
  const configFile = `../../.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}

export const dev = {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_PORT: process.env.DB_PORT,
  NODE_ENV: process.env.NODE_ENV,
};
