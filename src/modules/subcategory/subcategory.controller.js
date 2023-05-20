import slugify from "slugify";
import categoryModel from "../../../DB/models/category.model.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { catchError, GlobalError } from "../../utils/errorHandling.js";

export const subCategoryList = catchError(async (req, res, next) => {
  const subCategory = await subCategoryModel
    .find({ isDeleted: false })
    .populate([
      {
        path: "categoryId",
      },
    ]);
  return res
    .status(200)
    .json({ message: "DONE", subCategoriesList: subCategory });
});

export const createSubCategory = catchError(async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(
      new GlobalError({
        message: "In-valid category Id to create subCategory",
        statusCode: 404,
      })
    );
  }
  const name = req.body.name?.toLowerCase();
  const slug = slugify(name, "-");
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${category.name}/subCategory/picture` }
  );
  const subCategory = await subCategoryModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    categoryId,
    createdBy: req.user._id,
  });
  return res
    .status(201)
    .json({ message: "subCategory created successfully", subCategory });
});

export const updateSubCategory = catchError(async (req, res, next) => {
  const { categoryId, subCategoryId } = req.params;
  const name = req.body.name?.toLowerCase();
  const category = await categoryModel.findById(categoryId);

  if (!category) {
    return next(
      new GlobalError({
        message: "In-valid category Id to update subCategory",
        statusCode: 404,
      })
    );
  }
  const subCategory = await subCategoryModel.findById(subCategoryId);
  if (!subCategory) {
    return next(
      new GlobalError({
        message: "In-valid subCategory Id to update...",
        statusCode: 400,
      })
    );
  }
  if (req.body.name) {
    if (category.name == name) {
      //to check the name in the specific subCategory you update.
      return next(
        new GlobalError({
          message: "Sorry, can't update the subCategory with the same name",
          statusCode: 400,
        })
      );
    }
    subCategory.name = name;
    subCategory.slug = slugify(name, "-");
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${category.name}/subCategory/picture` }
    );
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    subCategory.image = { secure_url, public_id };
  }
  subCategory.updatedBy = req.user._id;
  await subCategory.save();
  return res
    .status(200)
    .json({ message: "Sub Category updated Successfully", subCategory });
});
