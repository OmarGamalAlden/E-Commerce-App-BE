import joi from "joi";
import { generalFeilds } from "../../middleware/validation.js";

export const createAndUpdate = joi
  .object({
    productId: generalFeilds.id,
    quantity: joi.number().integer().positive().required(),
  })
  .required();
