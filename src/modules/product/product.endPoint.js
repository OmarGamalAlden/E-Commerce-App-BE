import { roles } from "../../middleware/authentication.js";

export const endPoint = {
  create: [roles.admin],
  update: [roles.admin],
  wishlist: [roles.admin, roles.user],
};
