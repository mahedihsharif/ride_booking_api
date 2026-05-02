import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { envVars } from "./app/config/env";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.set("trust proxy", 1);
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Welcome to Ride Booking Backend!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
