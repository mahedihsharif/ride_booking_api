import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.get("/", checkAuth(Role.ADMIN), UserController.getAllRiders);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);
router.patch("/block/:id", checkAuth(Role.ADMIN), UserController.blockedUser);
export const UserRoutes = router;
