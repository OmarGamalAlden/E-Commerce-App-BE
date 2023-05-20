import categoryModel from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { catchError, GlobalError } from "../../utils/errorHandling.js";
import slugify from "slugify";

export const getCategory = catchError(async (req, res, next) => {
  const category = await categoryModel.find().populate([
    {
      path: "subCategories",
    },
  ]);
  return res.status(200).json({ message: "Done", categoryList: category });
});

export const createCategory = catchError(async (req, res, next) => {
  const name = req.body.name?.toLowerCase();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `Category/picture` }
  );
  const category = await categoryModel.create({
    name,
    slug: slugify(name, "-"),
    image: { secure_url, public_id },
    createdBy: req.user._id,
  });
  return res
    .status(201)
    .json({ message: "Category created successfully", category });
});

export const updateCategory = catchError(async (req, res, next) => {
  const { categoryId } = req.params;
  const name = req.body.name?.toLowerCase();
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(
      new GlobalError({ message: "In-valid category Id", statusCode: 404 })
    );
  }
  if (req.body.name) {
    if (category.name == name) {//to check the name in the specific category you update.
      return next(
        new GlobalError({
          message: "Sorry, can't update the category with the same name",
          statusCode: 400,
        })
      );
    }
    if (await categoryModel.findOne({ name })) {//to check the name of all categories in DB.
      return next(
        new GlobalError({
          message: "category name exist before, use a unique one",
          statusCode: 400,
        })
      );
    }
    category.name = name;
    category.slug = slugify(name, "-");
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `Category/picture` }
    );
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }
  category.updatedBy = req.user._id;
  await category.save();
  return res
    .status(201)
    .json({ message: "Category updated successfully", category });
});
