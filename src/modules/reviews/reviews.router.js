import { Router } from "express";
import * as reviewController from "./reviews.controller.js";
import * as validators from "./reviews.validation.js";
import auth from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import { endPoint } from "./reviews.endPoint.js";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.post(
  "/create",
  auth(endPoint.createReview),
  validation(validators.createReview),
  reviewController.createReview
);

reviewRouter.put(
  "/update/:reviewId",
  auth(endPoint.updateReview),
  validation(validators.updateReview),
  reviewController.updateReview
);

export default reviewRouter;
