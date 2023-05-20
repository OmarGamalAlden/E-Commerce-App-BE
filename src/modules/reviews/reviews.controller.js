import { catchError, GlobalError } from "../../utils/errorHandling.js";
import orderModel from "../../../DB/models/order.model.js";
import reviewModel from "../../../DB/models/review.model.js";

export const createReview = catchError(async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rate } = req.body;

  //first check if order is exist..
  const order = await orderModel.findOne({
    userId: req.user._id,
    status: "delivered",
    "ListOfProducts.productId": productId,
  });
  if (!order) {
    return next(
      new GlobalError({
        message: "Can't review product before deliver to you.",
        statusCode: 400,
      })
    );
  }

  //check user if create review before?!
  const checkReview = await reviewModel.findOne({
    createdBy: req.user._id,
    productId,
    orderId: order._id,
  });
  if (checkReview) {
    return next(
      new GlobalError({
        message: "This product is reviewed by you before..",
        statusCode: 400,
      })
    );
  }
  //then, Create review..
  const review = await reviewModel.create({
    comment,
    rate,
    createdBy: req.user._id,
    productId,
    orderId: order._id,
  });
  if (!review) {
    return next(
      new GlobalError({
        message: `Fail to create your review, Try again later..`,
        statusCode: 400,
      })
    );
  }
  return res
    .status(201)
    .json({ message: "Review created successfully", review });
});

export const updateReview = catchError(async (req, res, next) => {
  const { productId, reviewId } = req.params;
  const { comment, rate } = req.body;

  //then, Create review..
  const review = await reviewModel.findOneAndUpdate(
    { productId, _id: reviewId },
    { comment, rate },
    { new: true }
  );
  if (!review) {
    return next(
      new GlobalError({
        message: `Fail to update your review, Try again later..`,
        statusCode: 400,
      })
    );
  }
  return res
    .status(200)
    .json({ message: "Review updated successfully", review });
});
