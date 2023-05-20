import joi from "joi";
import { generalFeilds } from "../../middleware/validation.js";

export const createCategory = joi
  .object({
    name: joi.string().min(2).max(50).required(),
    file: generalFeilds.file.required(),
  })
  .required();

export const updateCategory = joi
  .object({
    categoryId: generalFeilds.id,
    name: joi.string().min(2).max(50),
    file: generalFeilds.file,
  })
  .required();
