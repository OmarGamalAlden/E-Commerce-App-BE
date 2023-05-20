import joi from "joi";
import { generalFeilds } from "../../middleware/validation.js";

export const createReview = joi
  .object({
    productId: generalFeilds.id,
    comment: joi.string().min(20).required(),
    rate: joi.number().positive().min(1).max(5).required(),
  })
  .required();

export const updateReview = joi
  .object({
    reviewId: generalFeilds.id,
    productId: generalFeilds.id,
    comment: joi.string().min(10).required(),
    rate: joi.number().positive().min(1).max(5).required(),
  })
  .required();
