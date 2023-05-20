import { roles } from "../../middleware/authentication.js";

export const endPoint = {
  createOrder: [roles.user, roles.admin],
  cancelOrder: [roles.user, roles.admin],
  updateOrderStatusByAdmin: [roles.admin],
};
