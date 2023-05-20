import { Router } from "express";
import auth from "../../middleware/authentication.js";
import * as orderController from "./order.controller.js";
import * as validators from "./order.validation.js";
import { endPoint } from "./order.endPoint.js";
import { validation } from "../../middleware/validation.js";
const orderRouter = Router();


orderRouter.post(
  "/create",
  auth(endPoint.createOrder),
  validation(validators.createOrder),
  orderController.createOrder
);

orderRouter.patch(
  "/cancel/:orderId",
  auth(endPoint.cancelOrder),
  validation(validators.cancelOrder),
  orderController.cancelOrder
);

orderRouter.patch(
  "/updateStatus/:orderId",
  auth(endPoint.updateOrderStatusByAdmin),
  validation(validators.updateOrderStatusByAdmin),
  orderController.updateOrderStatusByAdmin
);
export default orderRouter;
