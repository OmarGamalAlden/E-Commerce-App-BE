import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import * as cartController from "./cart.controller.js";
import * as validators from "./cart.validation.js";
import { endPoint } from "./cart.endPoint.js";
const cartRouter = Router();

cartRouter.post(
  "/create_update",
  auth(endPoint.createAndUpdate),
  validation(validators.createAndUpdate),
  cartController.createAndUpdateCart
);

cartRouter.patch(
  "/delete",
  auth(endPoint.createAndUpdate),
  cartController.deleteCart
);
cartRouter.patch(
  "/remove",
  auth(endPoint.createAndUpdate),
  cartController.emptyCart
);

export default cartRouter;
