import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { fileTypes, fileUpload } from "../../utils/cloudMulter.js";
import auth from "../../middleware/authentication.js"
import * as subCategoryController from "./subcategory.controller.js";
import * as validators from "./subcategory.validation.js";
import { endPoint } from "./subcategory.endPoint.js";
const subCategoryRouter = Router({ mergeParams: true });

subCategoryRouter.get("/", subCategoryController.subCategoryList);

subCategoryRouter.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.createSubCategory),
  subCategoryController.createSubCategory
);

subCategoryRouter.put(
  "/update/:subCategoryId",
  auth(endPoint.update),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.updateSubCategory),
  subCategoryController.updateSubCategory
);
export default subCategoryRouter;
