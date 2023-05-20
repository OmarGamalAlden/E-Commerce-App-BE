import slugify from "slugify";
import brandModel from "../../../DB/models/brand.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { catchError, GlobalError } from "../../utils/errorHandling.js";

export const getBrands = catchError(async (req, res, next) => {
  const brand = await brandModel.find({ isDeleted: false });
  return res.status(200).json({ message: "Done", brandList: brand });
});

export const createBrand = catchError(async (req, res, next) => {
  const name = req.body.name?.toLowerCase();
  if (req.body.name) {
    if (await brandModel.findOne({ name })) {
      return next(
        new GlobalError({
          message: "Brand name exist before, use a unique one",
          statusCode: 400,
        })
      );
    }
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `brand/picture` }
    );
    req.body.image = { secure_url, public_id };
  }

  const brand = await brandModel.create({
    name,
    slug: slugify(name, "-"),
    image: req.body.image,
    createdBy: req.user._id,
  });
  return res.status(201).json({ message: "brand created successfully", brand });
});

export const updateBrand = catchError(async (req, res, next) => {
  const { brandId } = req.params;
  const name = req.body.name?.toLowerCase();
  const brand = await brandModel.findById(brandId);
  if (!brand) {
    return next(
      new GlobalError({ message: "In-valid brand Id", statusCode: 404 })
    );
  }
  if (req.body.name) {
    if (brand.name == name) {//to check the name in the specific brand you update.
      return next(
        new GlobalError({
          message: "Sorry, can't update the brand with the same name",
          statusCode: 400,
        })
      );
    }
    if (await brandModel.findOne({ name })) {//to check the name of all brands in DB.
      return next(
        new GlobalError({
          message: "Brand name exist before, use a unique one",
          statusCode: 400,
        })
      );
    }
    brand.name = name;
    brand.slug = slugify(name, "-");
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `brand/picture` }
    );
    await cloudinary.uploader.destroy(brand.image.public_id);
    brand.image = { secure_url, public_id };
  }
  brand.updatedBy = req.user._id;
  await brand.save();
  return res.status(200).json({ message: "brand updated successfully", brand });
});
