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
  })
);
app.use(express.json());
app.set("trust proxy", 1);
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Ride Booking Backend!");
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
