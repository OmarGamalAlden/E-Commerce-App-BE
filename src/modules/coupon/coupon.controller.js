import couponModel from "../../../DB/models/coupon.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { catchError, GlobalError } from "../../utils/errorHandling.js";

export const getCoupon = catchError(async (req, res, next) => {
  const coupon = await couponModel.find();
  return res.status(200).json({ message: "Done", couponList: coupon });
});

export const createCoupon = catchError(async (req, res, next) => {
  const name = req.body.name.toLowerCase();

  if (await couponModel.findOne({ name })) {
    return next(
      new GlobalError({
        message: `Coupon Name ${name} is used by another coupon, please use a unique one..`,
        statusCode: 409,
      })
    );
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `coupon/picture` }
    );
    req.body.image = { secure_url, public_id };
  }
  req.body.createdBy = req.user._id;
  req.body.expireDate = new Date(req.body.expireDate); //must add Date in this format ("2023-05-06T08:53:43.019Z")!!!
  const coupon = await couponModel.create(req.body);
  return res
    .status(201)
    .json({ message: "coupon created successfully", coupon });
});

export const updateCoupon = catchError(async (req, res, next) => {
  const { couponId } = req.params;
  const name = req.body.name?.toLowerCase();
  const coupon = await couponModel.findById(couponId);

  if (!coupon) {
    return next(
      new GlobalError({ message: "In-valid coupon Id", statusCode: 404 })
    );
  }

  if (req.body.name) {
    if (coupon.name == name) {
      //to check the name in the specific coupon you update.
      return next(
        new GlobalError({
          message: "Sorry, can't update the coupon with the same name",
          statusCode: 400,
        })
      );
    }
    if (await couponModel.findOne({ name })) {
      //to check the name of all coupons in DB.
      return next(
        new GlobalError({
          message: "coupon name exist before, use a unique one",
          statusCode: 400,
        })
      );
    }
    coupon.name = name;
  }
  if (req.body.amount) {
    if (coupon.amount == req.body.amount) {
      //to check the amount of coupon in the specific coupon you update.
      return next(
        new GlobalError({
          message: "Sorry, can't update the coupon with the same amount",
          statusCode: 400,
        })
      );
    }
    coupon.amount = req.body.amount;
  }
  if (req.body.expireDate) {
    coupon.expireDate = new Date(req.body.expireDate);
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `coupon/picture` }
    );
    await cloudinary.uploader.destroy(coupon.image.public_id);
    coupon.image = { secure_url, public_id };
  }

  coupon.updatedBy = req.user._id;
  await coupon.save();
  return res
    .status(200)
    .json({ message: "coupon updated successfully", coupon });
});
