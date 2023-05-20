import joi from "joi";
import { generalFeilds } from "../../middleware/validation.js";

export const createSubCategory = joi
  .object({
    name: joi.string().min(2).max(50).required(),
    categoryId: generalFeilds.id,
    file: generalFeilds.file.required(),
  })
  .required();

export const updateSubCategory = joi
  .object({
    name: joi.string().min(2).max(50),
    categoryId: generalFeilds.id,
    subCategoryId: generalFeilds.id,
    file: generalFeilds.file,
  })
  .required();
