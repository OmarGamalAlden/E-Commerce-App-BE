import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileTypes } from "../../utils/cloudMulter.js";
import auth from "../../middleware/authentication.js"
import * as couponController from "./coupon.controller.js";
import * as validators from "./coupon.validation.js";
import { endPoint } from "./coupon.endPoint.js";
const couponRouter = Router();

//coupon Routes...
couponRouter.get("/", couponController.getCoupon);

couponRouter.post(
  "/create",
  auth(endPoint.create),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.createcoupon),
  couponController.createCoupon
);

couponRouter.put(
  "/update/:couponId",
  auth(endPoint.update),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.updatecoupon),
  couponController.updateCoupon
);

export default couponRouter;
