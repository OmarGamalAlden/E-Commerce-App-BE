import { generalFeilds } from "../../middleware/validation.js";
import joi from "joi";

export const createOrder = joi
  .object({
    products: joi
      .array()
      .items({
        productId: generalFeilds.id,
        quantity: joi.number().integer().positive().required(),
      })
      .min(1),
    address: joi.string().required(),
    phone: joi.array().items(joi.string().required()).min(1).required(),
    note: joi.string(),
    reason: joi.string(),
    couponName: joi.string(),
    paymentType: joi.string(),
  })
  .required();

export const cancelOrder = joi
  .object({
    orderId: generalFeilds.id,
    reason: joi.string().required(),
  })
  .required();

  export const updateOrderStatusByAdmin = joi
  .object({
    orderId: generalFeilds.id,
    status: joi.string().valid("delivered" ,"onWay").required(),
  })
  .required();
