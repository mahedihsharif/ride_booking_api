import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { DriverController } from "../driver/driver.controller";
import { Role } from "../user/user.interface";
import { RideController } from "./ride.controller";
import { createRideZodSchema } from "./ride.validation";

const router = Router();

/*--------------- Rider Routes Method -------------------*/
router.post(
  "/request",
  checkAuth(Role.RIDER),
  validateRequest(createRideZodSchema),
  RideController.requestRide
);
router.get("/", checkAuth(Role.ADMIN), RideController.getAllRides);
router.get("/me", checkAuth(Role.RIDER), RideController.getRiderAllRides);
router.get("/available", checkAuth(Role.DRIVER), RideController.ridesAvailable);
router.get(
  "/completed",
  checkAuth(Role.DRIVER),
  RideController.getAllCompletedRides
);
router.get(
  "/history",
  checkAuth(Role.ADMIN),
  RideController.getAllRidesHistory
);
router.get("/:id", checkAuth(Role.RIDER), RideController.getRiderSingleRide);
router.patch("/:id/cancel", checkAuth(Role.RIDER), RideController.cancelRide);

/*--------------- Driver Routes Method -------------------*/

router.patch(
  "/:id/accept",
  checkAuth(Role.DRIVER),
  DriverController.acceptRide
);
router.patch(
  "/:id/reject",
  checkAuth(Role.DRIVER),
  DriverController.rejectRide
);
router.patch(
  "/:id/status",
  checkAuth(Role.DRIVER),
  DriverController.updateStatus
);

export const RideRoutes = router;
