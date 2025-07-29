import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Mongodb Connected Successfully!");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is Listening at Port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection Detected...Server Shutting down.", err);
  if (server) {
    server.close();
    process.exit(1);
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("UnCaught Exception Detected...Server Shutting down.", err);
  if (server) {
    server.close();
    process.exit(1);
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("Signal Terminal Detected...Server Shutting down.");
  if (server) {
    server.close();
    process.exit(1);
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT Detected...Server Shutting down.");
  if (server) {
    server.close();
    process.exit(1);
  }
  process.exit(1);
});
