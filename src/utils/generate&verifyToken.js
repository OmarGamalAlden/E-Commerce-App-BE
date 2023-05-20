import jwt from "jsonwebtoken";

export const generateToken = ({
  payLoad,
  signature = process.env.TOKEN_SIGNATURE,
  expiresIn = 60 * 60,
} = {}) => {
  const token = jwt.sign(payLoad, signature, { expiresIn });
  return token;
};

export const verifyToken = ({
  token,
  signature = process.env.TOKEN_SIGNATURE,
} = {}) => {
  const decoded = jwt.verify(token, signature);
  return decoded;
};
