import * as userController from "./user.controller.js";
import { Router } from "express";
import auth, { roles } from "../../middleware/authentication.js";
const userRouter = Router();

userRouter.get("/", userController.users);

userRouter.put(
  "/update",
  auth(Object.values(roles)),
  userController.updateUser
);
export default userRouter;
