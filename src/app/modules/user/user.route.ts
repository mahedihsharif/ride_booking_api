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
router.get("/all-users", checkAuth(Role.ADMIN), UserController.getAllUsers);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);
export const UserRoutes = router;
