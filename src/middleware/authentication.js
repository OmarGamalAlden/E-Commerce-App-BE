import userModel from "../../DB/models/user.model.js";
import { catchError, GlobalError } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/generate&verifyToken.js";

export const roles = {
  admin: "admin",
  user: "user",
  HR: "HR",
};

const auth = (accessRoles = []) => {
  return catchError(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(
        new GlobalError({
          message: "authorization is required",
          statusCode: 401,
        })
      );
    }
    if (!authorization.startsWith(process.env.BEARER_KEY)) {
      return next(
        new GlobalError({ message: "In-valid Bearer Key", statusCode: 400 })
      );
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    if (!token) {
      return next(
        new GlobalError({ message: "In-valid Token", statusCode: 400 })
      );
    }
    const decoded = verifyToken({ token });
    if (!decoded?.id) {
      return next(
        new GlobalError({ message: "In-valid token payload", statusCode: 400 })
      );
    }
    const authUser = await userModel.findById(decoded.id);
    if (!authUser) {
      return next(
        new GlobalError({ message: "not register account", statusCode: 401 })
      );
    }
    if (
      parseInt(authUser.changedPasswordTime?.getTime() / 1000) > decoded.iat
    ) {
      return next(
        new GlobalError({ message: "You use an expire token", statusCode: 400 })
      );
    }
    if (!accessRoles.includes(authUser.role)) {
      return next(
        new GlobalError({ message: "not authorized account", statusCode: 403 })
      );
    }
    req.user = authUser;
    return next();
  });
};
export default auth;
