import mongoose, { model, Schema, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    slug: { type: String, required: true, lowercase: true },
    slogan: { type: String },
    image: { type: Object },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const brandModel = mongoose.models.Brand || model("Brand", brandSchema);
export default brandModel;
