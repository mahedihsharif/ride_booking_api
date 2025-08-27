import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import {
  getDriverActivity,
  getRevenueTrends,
  getRideVolume,
} from "./analytics.controller";

const router = express.Router();

router.get("/ride-volume", checkAuth(Role.ADMIN), getRideVolume);
router.get("/revenue-trends", checkAuth(Role.ADMIN), getRevenueTrends);
router.get("/driver-activity", checkAuth(Role.ADMIN), getDriverActivity);

export const AnalyticsRoutes = router;
