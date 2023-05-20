import { generalFeilds } from "../../middleware/validation.js";
import joi from "joi";

export const createProduct = joi
  .object({
    name: joi.string().min(5).max(150).required(),
    description: joi.string().min(5).max(150000),
    size: joi.array(),
    colors: joi.array(),
    stock: joi.number().integer().positive().min(1).required(),
    price: joi.number().positive().min(1).required(),
    discount: joi.number().positive().min(1),
    file: joi
      .object({
        mainImage: joi
          .array()
          .items(generalFeilds.file.required())
          .length(1)
          .required(),
        subImages: joi
          .array()
          .items(generalFeilds.file.required())
          .min(1)
          .max(5),
      })
      .required(),
    categoryId: generalFeilds.id,
    subCategoryId: generalFeilds.id,
    brandId: generalFeilds.id,
    createdBy: generalFeilds.id,
  })
  .required();

export const updateProduct = joi
  .object({
    name: joi.string().min(5).max(150),
    description: joi.string().min(5).max(150000),
    size: joi.array(),
    colors: joi.array(),
    stock: joi.number().integer().positive().min(1),
    price: joi.number().positive().min(1),
    discount: joi.number().positive().min(1),
    file: joi.object({
      mainImage: joi.array().items(generalFeilds.file.required()).max(1),
      subImages: joi.array().items(generalFeilds.file.required()).min(1).max(5),
    }),
    categoryId: generalFeilds.optionalId,
    subCategoryId: generalFeilds.optionalId,
    brandId: generalFeilds.optionalId,
    createdBy: generalFeilds.id,
    productId: generalFeilds.id,
  })
  .required();

export const Wishlist = joi
  .object({
    productId: generalFeilds.id,
  })
  .required();
