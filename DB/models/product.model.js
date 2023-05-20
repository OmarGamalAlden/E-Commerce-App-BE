import mongoose, { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: String,
    stock: {
      type: Number,
      default: 1,
      required: true,
    },
    price: {
      type: Number,
      default: 1,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 1,
      required: true,
    },
    colors: [String],
    size: {
      type: [String],
      enum: ["s", "m", "l", "xl", "xxl", "xxxl"],
    },
    mainImage: {
      type: Object,
      required: true,
    },
    subImages: {
      type: [Object],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    categoryId: {
      required: true,
      type: Types.ObjectId,
      ref: "Category",
    },
    subCategoryId: {
      required: true,
      type: Types.ObjectId,
      ref: "SubCategory",
    },
    brandId: {
      required: true,
      type: Types.ObjectId,
      ref: "Brand",
    },
    wishListUsers: [{ type: Types.ObjectId, ref: "User" }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    customId: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

productSchema.virtual("review", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});
const productModel = mongoose.models.Product || model("Product", productSchema);
export default productModel;
