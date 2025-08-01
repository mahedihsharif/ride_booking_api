import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DriverController } from "./driver.controller";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), DriverController.getAllDrivers);

router.get(
  "/available-driver",
  checkAuth(Role.RIDER),
  DriverController.availableDriver
);

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

router.patch(
  "/approve/:id",
  checkAuth(Role.ADMIN),
  DriverController.approveDriver
);

router.patch(
  "/suspend/:id",
  checkAuth(Role.ADMIN),
  DriverController.suspendDriver
);

export const DriverRoutes = router;
