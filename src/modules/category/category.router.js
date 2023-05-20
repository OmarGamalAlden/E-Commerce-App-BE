import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileTypes } from "../../utils/cloudMulter.js";
import subCategoryRouter from "../subcategory/subcategory.router.js";
import * as categoryController from "./category.controller.js";
import { endPoint } from "./category.endPoint.js";
import * as validators from "./category.validation.js";
const categoryRouter = Router();

//nested routes form main category to subCategories..
categoryRouter.use("/:categoryId/subCategory", subCategoryRouter);

//Category Routes...
categoryRouter.get(
  "/",
  categoryController.getCategory
);

categoryRouter.post(
  "/create",
  auth(endPoint.create),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.createCategory),
  categoryController.createCategory
);

categoryRouter.put(
  "/update/:categoryId",
  auth(endPoint.update),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.updateCategory),
  categoryController.updateCategory
);

export default categoryRouter;
