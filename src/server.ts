import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    console.log("Starting server...");
    console.log(`Environment: ${envVars.NODE_ENV}`);
    console.log(`Port: ${envVars.PORT}`);
    console.log(`Database URL: ${envVars.DB_URL ? "Set" : "Not set"}`);
    
    // Try to connect to database, but don't fail if it doesn't work
    try {
      await mongoose.connect(envVars.DB_URL);
      console.log("Mongodb Connected Successfully!");
    } catch (dbError) {
      console.error("Database connection failed, but starting server anyway:", dbError instanceof Error ? dbError.message : String(dbError));
      console.warn("Server will start without database connection");
    }
    
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is Listening at Port ${envVars.PORT}`);
      console.log("Server started successfully!");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    process.exit(1);
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
