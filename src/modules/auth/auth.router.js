import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as authController from "./auth.controller.js";
import * as validators from "./auth.validation.js";
const authRouter = Router();

authRouter.post(
  "/signUp",
  validation(validators.signUpSchema),
  authController.signUp
); // user sign up
authRouter.get("/confirmEmail/:token", authController.confirmEmail); // send confirm email to user
authRouter.get("/newConfirmEmail/:token", authController.newConfirmEmail); //user request new confirm email
authRouter.post(
  "/logIn",
  validation(validators.logInSchema),
  authController.logIn
); // user log in
authRouter.patch(
  "/sendCode",
  validation(validators.sendCodeSchema),
  authController.sendCode
); //send code to user for chanage password
authRouter.patch(
  "/resetPassword",
  validation(validators.resetPasswordSchema),
  authController.resetPassword
); //reset new password

export default authRouter;
