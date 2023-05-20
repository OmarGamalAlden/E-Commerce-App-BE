import { roles } from "../../middleware/authentication.js";

export const endPoint = {
  createAndUpdate: [roles.user, roles.admin],
};
