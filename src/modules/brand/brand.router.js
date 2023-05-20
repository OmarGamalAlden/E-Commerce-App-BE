import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileTypes } from "../../utils/cloudMulter.js";
import auth from "../../middleware/authentication.js"
import * as brandController from "./brand.controller.js";
import * as validators from "./brand.validation.js";
import { endPoint } from "./brand.endPoint.js";
const brandRouter = Router();

//brand Routes...
brandRouter.get("/", brandController.getBrands);

brandRouter.post(
  "/create",
  auth(endPoint.create),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.createBrand),
  brandController.createBrand
);

brandRouter.put(
  "/update/:brandId",
  auth(endPoint.update),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.updateBrand),
  brandController.updateBrand
);

export default brandRouter;
