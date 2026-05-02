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
  GEO_LOCATION_API: string;
  FRONTEND_URL: string;
  TWILIO_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_WHATSAPP_NUMBER: string;
  TWILIO_PHONE_NUMBER: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "DB_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
  ];
  
  const optionalEnvVariables: string[] = [
    "PORT",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_EXPIRES",
    "OPEN_CASE_MAPS_API_KEY",
    "PER_KM_RATE",
    "CANCEL_WINDOW_TIME",
    "GEO_LOCATION_API",
    "FRONTEND_URL",
    "TWILIO_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_WHATSAPP_NUMBER",
    "TWILIO_PHONE_NUMBER",
  ];
  
  // Check only required variables
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw Error(`Missing env Variables ${key}`);
    }
  });
  return {
    PORT: process.env.PORT || "3000",
    DB_URL: process.env.DB_URL!,
    NODE_ENV: (process.env.NODE_ENV as "development" | "production") || "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND || "12",
    JWT: {
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
      JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
      JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",
    },
    OPEN_CASE_MAPS_API_KEY: process.env.OPEN_CASE_MAPS_API_KEY || "",
    PER_KM_RATE: process.env.PER_KM_RATE || "10",
    CANCEL_WINDOW_TIME: process.env.CANCEL_WINDOW_TIME || "5",
    GEO_LOCATION_API: process.env.GEO_LOCATION_API || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "https://your-frontend.vercel.app",
    TWILIO_SID: process.env.TWILIO_SID || "",
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
    TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER || "",
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || "",
  };
};

export const envVars = loadEnvVariables();
