import bcrypt from "bcryptjs";

export const hasing = ({
  plainText,
  saltRound = process.env.SALT_ROUND,
} = {}) => {
  const hashedValue = bcrypt.hashSync(plainText, parseInt(saltRound));
  return hashedValue;
};

export const compareing = ({ plainText, hasedValue } = {}) => {
  const compareResult = bcrypt.compareSync(plainText, hasedValue);
  return compareResult;
};
