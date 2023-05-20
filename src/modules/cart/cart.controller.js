import { catchError, GlobalError } from "../../utils/errorHandling.js";
import productModel from "../../../DB/models/product.model.js";
import cartModel from "../../../DB/models/cart.model.js";

export const createAndUpdateCart = catchError(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(
      new GlobalError({
        message: "Product not found or In-valid ID",
        statusCode: 400,
      })
    );
  }
  if (product.isDeleted) {
    return next(
      new GlobalError({
        message: "Product isn't exist to be able to use or Product Deleted..",
        statusCode: 400,
      })
    );
  }
  if (quantity > product.stock) {
    return next(
      new GlobalError({
        message: `You reach the maximum of ${quantity} product items. You can buy only ${
          product.stock - 1
        } items `,
        statusCode: 400,
      })
    );
  }
  //check cart exist
  const cart = await cartModel.findOne({ userId: req.user._id });
  //if not exist create new one..
  if (!cart) {
    const newCart = await cartModel.create({
      userId: req.user._id,
      ListOfProducts: [{ productId, quantity }],
    });
    return res
      .status(201)
      .json({ message: "Cart created successfully", cart: newCart });
  }

  //if exist????

  //there are two options!
  //first one, User try to update the quantity of product, So...
  let matchProduct = false;
  for (const file of cart.ListOfProducts) {
    if (file.productId.toString() == productId) {
      file.quantity = quantity;
      matchProduct = true;
      break;
    }
  }
  //seconad one, User try to add new products to his cart, So...
  if (!matchProduct) {
    cart.ListOfProducts.push({ productId, quantity });
  }
  await cart.save();
  return res.status(200).json({ message: "Cart updated successfully", cart });
});

export const deleteCart = catchError(async (req, res, next) => {
  const { productsIDs } = req.body;
  const cart = await delteItemsFromCart(req.user._id, productsIDs);
  return res
    .status(200)
    .json({ message: "The specific cart items are deleted..", cart });
});

export const emptyCart = catchError(async (req, res, next) => {
  const cart = await clearAllItemsFromCart(req.user._id);
  return res
    .status(200)
    .json({ message: " Cart items are deleted successfully..", cart });
});

//general functions to delete or clear cart items...

export async function delteItemsFromCart(userId, productsIDs) {
  const cart = await cartModel.updateOne(
    { userId },
    {
      $pull: {
        ListOfProducts: {
          productId: { $in: productsIDs },
        },
      },
    }
  );
  return cart;
}

export async function clearAllItemsFromCart(userId) {
  const cart = await cartModel.updateOne({ userId }, { ListOfProducts: [] });
  return cart;
}


