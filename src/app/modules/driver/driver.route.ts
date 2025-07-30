import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DriverController } from "./driver.controller";

const router = Router();

router.get(
  "/earnings",
  checkAuth(Role.DRIVER),
  DriverController.driverEarnings
);

router.patch(
  "/availability",
  checkAuth(Role.DRIVER),
  DriverController.setAvailability
);

export const DriverRoutes = router;
