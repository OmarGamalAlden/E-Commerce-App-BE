import joi from "joi";
import { generalFeilds } from "../../middleware/validation.js";

export const signUpSchema = joi
  .object({
    userName: generalFeilds.userName,
    email: generalFeilds.email,
    password: generalFeilds.password,
    cPassword: generalFeilds.cPassword.valid(joi.ref("password")),
  })
  .required();

export const logInSchema = joi
  .object({
    email: generalFeilds.email,
    password: generalFeilds.password,
  })
  .required();

export const sendCodeSchema = joi
  .object({
    email: generalFeilds.email,
  })
  .required();

export const resetPasswordSchema = joi
  .object({
    email: generalFeilds.email,
    newPassword: generalFeilds.password,
    confirmNewPassword: generalFeilds.cPassword.valid(joi.ref("newPassword")),
    resetCode: joi
      .string()
      .pattern(new RegExp(/^[0-9]{4}$/))
      .required(),
  })
  .required();
