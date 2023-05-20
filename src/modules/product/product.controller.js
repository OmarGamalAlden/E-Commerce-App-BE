import { GlobalError, catchError } from "../../utils/errorHandling.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";
import brandModel from "../../../DB/models/brand.model.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import productModel from "../../../DB/models/product.model.js";
import ApiFeatures from "../../utils/apiFeatures.js";

export const productsList = catchError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    productModel.find().populate([
      {
        path: "review",
      },
    ]),
    req.query
  )
    .filter()
    .search()
    .select()
    .sort()
    .pignate();
  const products = await apiFeatures.mongooseQuery;

  //calculate product average rating
  for (let i = 0; i < products.length; i++) {
    let calcRating = 0;
    for (let j = 0; j < products[i].review.length; j++) {
      calcRating += products[i].review[j].rate;
    }
    let avgRating = calcRating / products[i].review.length;
    let product = products[i].toObject();
    product.avgRating = avgRating;
    products[i] = product;
  }

  return res.status(200).json({ message: "Products List is ready", products });
});

export const createProduct = catchError(async (req, res, next) => {
  const { name, price, discount, categoryId, subCategoryId, brandId } =
    req.body;
  if (!(await subCategoryModel.findOne({ _id: subCategoryId, categoryId }))) {
    return next(
      new GlobalError({
        message: "In-valid Category or SubCategory ID",
        statusCode: 400,
      })
    );
  }
  if (!(await brandModel.findOne({ _id: brandId }))) {
    return next(
      new GlobalError({ message: "In-valid Brand ID", statusCode: 400 })
    );
  }
  req.body.slug = slugify(name, {
    lower: true,
    replacement: "-",
    trim: true,
  });
  req.body.finalPrice = Number.parseFloat(
    price - price * (discount / 100)
  ).toFixed(2);
  req.body.customId = nanoid();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: `products/${req.body.customId}` }
  );
  req.body.mainImage = { secure_url, public_id };
  if (req.files.subImages) {
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `products/${req.body.customId}/subImages` }
      );
      req.body.subImages.push({ secure_url, public_id });
    }
  }
  const product = await productModel.create(req.body);
  if (!product) {
    await cloudinary.uploader.destroy(req.body.mainImage.public_id);
    for (const file of req.body.subImages) {
      await cloudinary.uploader.destroy(file.public_id);
    }
    return next(
      new GlobalError({ message: "fail to create product", statusCode: 400 })
    );
  }
  return res
    .status(201)
    .json({ message: "product created successfully", product });
});

export const updateProduct = catchError(async (req, res, next) => {
  const { productId } = req.params;
  //check first product exist
  const checkProduct = await productModel.findById(productId);
  if (!checkProduct) {
    return next(
      new GlobalError({ message: "In-valid product ID", statusCode: 400 })
    );
  }
  //check category, subCategory and brand
  if (req.body.subCategoryId && req.body.categoryId) {
    if (
      !(await subCategoryModel.findOne({
        _id: req.body.subCategoryId,
        categoryId: req.body.categoryId,
      }))
    ) {
      return next(
        new GlobalError({
          message: "In-valid Category or SubCategory ID",
          statusCode: 400,
        })
      );
    }
    //if admin want to move produt to another category or subCategory
    checkProduct.subCategoryId = req.body.subCategoryId;
    checkProduct.categoryId = req.body.categoryId;
  }
  if (req.body.brandId) {
    if (!(await brandModel.findOne({ _id: req.body.brandId }))) {
      return next(
        new GlobalError({
          message: "Not found Brand or In-valid Brand ID",
          statusCode: 400,
        })
      );
    }
    //if admin want to change brand
    checkProduct.brandId = req.body.brandId;
  }

  //update general feilds....

  //update name
  if (req.body.name) {
    checkProduct.name = req.body.name.toLowerCase();
    checkProduct.slug = slugify(req.body.name, {
      lower: true,
      replacement: "-",
      trim: true,
    });
  }
  //update price
  if (req.body.price && req.body.discount) {
    checkProduct.finalPrice = Number.parseFloat(
      req.body.price - req.body.price * (req.body.discount / 100)
    ).toFixed(2);
    checkProduct.price = req.body.price;
    checkProduct.discount = req.body.discount;
  } else if (req.body.price) {
    checkProduct.finalPrice = Number.parseFloat(
      req.body.price - req.body.price * (checkProduct.discount / 100)
    ).toFixed(2);
    checkProduct.price = req.body.price;
  } else if (req.body.discount) {
    checkProduct.finalPrice = Number.parseFloat(
      checkProduct.price - checkProduct.price * (req.body.discount / 100)
    ).toFixed(2);
    checkProduct.discount = req.body.discount;
  }
  //update images
  if (req.files) {
    if (req.files.mainImage?.length) {
      await cloudinary.uploader.destroy(checkProduct.mainImage.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.mainImage[0].path,
        { folder: `products/${checkProduct.customId}` }
      );
      checkProduct.mainImage = { secure_url, public_id };
    }
    if (req.files.subImages?.length) {
      for (const file of checkProduct.subImages) {
        await cloudinary.uploader.destroy(file.public_id);
      }
      req.body.subImages = [];
      for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          { folder: `products/${checkProduct.customId}/subImages` }
        );
        req.body.subImages.push({ secure_url, public_id });
        checkProduct.subImages = req.body.subImages;
      }
    }
  }
  //update stock number
  if (req.body.stock) {
    checkProduct.stock = req.body.stock;
  }
  //update size and colors
  if (req.body.size) {
    checkProduct.size = req.body.size;
  }
  if (req.body.colors) {
    checkProduct.colors = req.body.colors;
  }
  //finally save changes...
  checkProduct.updatedBy = req.user._id;
  await checkProduct.save();
  return res
    .status(200)
    .json({ message: "Product updated successfully", product: checkProduct });
});

//user wishlist...

export const addToWishlist = catchError(async (req, res, next) => {
  if (!(await productModel.findById(req.params.productId))) {
    return next(
      new GlobalError({ message: "In-valid product ID", statusCode: 404 })
    );
  }
  await productModel.updateOne(
    { _id: req.params.productId },
    { $addToSet: { wishListUsers: req.user._id } },
    { new: true }
  );
  return res.status(200).json({
    message: "Product added to your wishlist successfully",
  });
});

export const removeFromWishlist = catchError(async (req, res, next) => {
  if (!(await productModel.findById(req.params.productId))) {
    return next(
      new GlobalError({ message: "In-valid product ID", statusCode: 404 })
    );
  }
  await productModel.updateOne(
    { _id: req.params.productId },
    { $pull: { wishListUsers: req.user._id } },
    { new: true }
  );
  return res.status(200).json({
    message: "Product removed from your wishlist successfully",
  });
});
