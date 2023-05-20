import { roles } from "../../middleware/authentication.js";

export const endPoint = {
  createReview: [roles.admin, roles.user],
  updateReview: [roles.admin, roles.user],
};
