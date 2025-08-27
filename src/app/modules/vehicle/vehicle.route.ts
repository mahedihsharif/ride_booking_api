import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { VehicleController } from "./vehicle.controller";

const router = express.Router();

router.patch(
  "/",
  checkAuth(Role.DRIVER),
  VehicleController.updateVehicleDetails
);

export const VehicleRoutes = router;
