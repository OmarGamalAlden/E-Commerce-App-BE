import joi from "joi";
import { generalFeilds } from "../../middleware/validation.js";

export const createBrand = joi
  .object({
    name: joi.string().min(2).max(50).required(),
    file: generalFeilds.file,
  })
  .required();

export const updateBrand = joi
  .object({
    brandId: generalFeilds.id,
    name: joi.string().min(2).max(50),
    file: generalFeilds.file,
  })
  .required();
