import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT_ROUND: string;
  JWT: {
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
  };
  OPEN_CASE_MAPS_API_KEY: string;
  PER_KM_RATE: string;
  CANCEL_WINDOW_TIME: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "OPEN_CASE_MAPS_API_KEY",
    "PER_KM_RATE",
    "CANCEL_WINDOW_TIME",
  ];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw Error(`Missing env Variables ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT: {
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
      JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
      JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    },
    OPEN_CASE_MAPS_API_KEY: process.env.OPEN_CASE_MAPS_API_KEY as string,
    PER_KM_RATE: process.env.PER_KM_RATE as string,
    CANCEL_WINDOW_TIME: process.env.CANCEL_WINDOW_TIME as string,
  };
};

export const envVars = loadEnvVariables();
