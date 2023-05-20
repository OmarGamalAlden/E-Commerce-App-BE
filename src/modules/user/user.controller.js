import userModel from "../../../DB/models/user.model.js";
import { catchError, GlobalError } from "../../utils/errorHandling.js";

export const users = catchError(async (req, res, next) => {
  const user = await userModel.find();
  return res.status(200).json({ message: "Done", UserList: user });
});

export const updateUser = catchError(async (req, res, next) => {// don't forgot handel update...
  const { role } = req.body;
  const checkUser = await userModel.findOne({ email: req.user.email });
  if (!checkUser) {
    return next(
      new GlobalError({
        message: "there is no account with this email",
        statusCode: 404,
      })
    );
  }
  checkUser.role = role;
  await checkUser.save();
  return res
    .status(200)
    .json({ message: "user updated successfully", user: checkUser });
});
