import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get(
  "/earnings",
  checkAuth(Role.DRIVER),
  StatsController.getEarningStats
);

export const StatsRoutes = router;
