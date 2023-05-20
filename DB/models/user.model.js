import mongoose, { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "maximum length 20 char"],
      lowercase: true,
    },
    email: {
      type: String,
      unique: [true, "email must be unique"],
      required: [true, "email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "HR"],
    },
    status: {
      type: String,
      default: "offline",
      enum: ["offline", "online", "blocked"],
    },
    gender: {
      type: String,
      default: "male",
      enum: ["male", "female"],
    },
    resetCode: {
      type: Number,
      default: null,
    },
    changedPasswordTime: {
      type: Date,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    image: {
      type: Object,
    },
    dateOfBitrh: {
      type: String,
    },
    wishlist: {
      type: [{ type: Types.ObjectId, ref: "Product" }],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
