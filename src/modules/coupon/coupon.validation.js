import joi from "joi";
import { generalFeilds } from "../../middleware/validation.js";

export const createcoupon = joi
  .object({
    name: joi.string().min(2).max(50).required(),
    amount: joi.number().positive().min(1).max(100).required(),
    expireDate: joi.date().greater(Date.now()).required(),
    file: generalFeilds.file,
  })
  .required();

export const updatecoupon = joi
  .object({
    couponId: generalFeilds.id,
    name: joi.string().min(2).max(50),
    expireDate: joi.date().greater(Date.now()),
    amount: joi.number().positive().min(1).max(100),
    file: generalFeilds.file,
  })
  .required();
