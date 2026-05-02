import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { SOSController } from "./sos.controller";
import { sendSOSZodSchema } from "./sos.validation";

const router = Router();

router.post(
  "/send",
  checkAuth(Role.RIDER, Role.DRIVER),
  validateRequest(sendSOSZodSchema),
  SOSController.sendSOS
);

export const SOSRoutes = router;
