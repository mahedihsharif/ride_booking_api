import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DriverRoutes } from "../modules/driver/driver.route";
import { RideRoutes } from "../modules/ride/ride.route";

import { AnalyticsRoutes } from "../modules/analytics/analytics.route";
import { SMSRoutes } from "../modules/SMS/sms.route";
import { StatsRoutes } from "../modules/stats/stats.route";
import { UserRoutes } from "../modules/user/user.route";
import { VehicleRoutes } from "../modules/vehicle/vehicle.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/rides",
    route: RideRoutes,
  },
  {
    path: "/drivers",
    route: DriverRoutes,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },
  {
    path: "/vehicle",
    route: VehicleRoutes,
  },
  {
    path: "/analytics",
    route: AnalyticsRoutes,
  },
  {
    path: "/sms",
    route: SMSRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
