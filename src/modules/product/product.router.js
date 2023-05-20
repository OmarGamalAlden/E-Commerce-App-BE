import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import { fileTypes, fileUpload } from "../../utils/cloudMulter.js";
import reviewRouter from "../reviews/reviews.router.js";
import * as productController from "./product.controller.js";
import { endPoint } from "./product.endPoint.js";
import * as validators from "./product.validation.js";

const productRouter = Router();

productRouter.use("/:productId/review", reviewRouter);

productRouter.get("/", productController.productsList);

productRouter.post(
  "/create",
  auth(endPoint.create),
  fileUpload(fileTypes.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  validation(validators.createProduct),
  productController.createProduct
);

productRouter.put(
  "/update/:productId",
  auth(endPoint.update),
  fileUpload(fileTypes.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  validation(validators.updateProduct),
  productController.updateProduct
);

productRouter.patch(
  //add product to user wishlist
  "/:productId/addToWishlist",
  auth(endPoint.wishlist),
  validation(validators.Wishlist),
  productController.addToWishlist
);

productRouter.patch(
  //remove product from user wishlist
  "/:productId/removeFromWishlist",
  auth(endPoint.wishlist),
  validation(validators.Wishlist),
  productController.removeFromWishlist
);

export default productRouter;
