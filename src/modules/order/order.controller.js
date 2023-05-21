import { GlobalError, catchError } from "../../utils/errorHandling.js";
import couponModel from "../../../DB/models/coupon.model.js";
import productModel from "../../../DB/models/product.model.js";
import orderModel from "../../../DB/models/order.model.js";
import cartModel from "../../../DB/models/cart.model.js";
import {
  clearAllItemsFromCart,
  delteItemsFromCart,
} from "../cart/cart.controller.js";
import payment from "../../utils/payment.js";
import Stripe from "stripe";

//important controller
export const createOrder = catchError(async (req, res, next) => {
  //there are two senarios to create order:

  /********************************************************************************************/
  //The first one is select some items from user's cart to create order, and this is its code...
  /********************************************************************************************/

  // const { products, address, phone, note, reason, couponName, paymentType } =
  //   req.body;
  // //first check the coupon conditions if exist!!
  // if (couponName) {
  //   const coupon = await couponModel.findOne({
  //     name: couponName.toLowerCase(),
  //   });
  //   if (!coupon) {
  //     return next(
  //       new GlobalError({ message: "In-valid coupon name", statusCode: 404 })
  //     );
  //   }
  //   if (coupon.expireDate.getTime() < Date.now()) {
  //     return next(
  //       new GlobalError({
  //         message: "The coupon you use is expired",
  //         statusCode: 400,
  //       })
  //     );
  //   }
  //   if (coupon.usedBy.includes(req.user._id)) {
  //     return next(
  //       new GlobalError({
  //         message: "Coupon is used by you before",
  //         statusCode: 400,
  //       })
  //     );
  //   }
  //   req.body.coupon = coupon;
  // }

  // //check product conditions..

  // let finalProductList = [];
  // let productsIDs = [];
  // let subTotal = 0;

  // for (const product of products) {
  //   const checkProduct = await productModel.findOne({
  //     _id: product.productId,
  //     stock: { $gte: product.quantity },
  //     isDeleted: false,
  //   });
  //   if (!checkProduct) {
  //     return next(
  //       new GlobalError({
  //         message: `Can't add product with ID "${product.productId}" to your order list`,
  //         statusCode: 400,
  //       })
  //     );
  //   }
  //   productsIDs.push(product.productId);
  //   product.name = checkProduct.name;
  //   product.unitPrice = checkProduct.finalPrice;
  //   product.finalPrice = product.unitPrice * product.quantity;
  //   finalProductList.push(product);
  //   subTotal += product.finalPrice;
  // }
  // const dummyOrder = {
  //   userId: req.user._id,
  //   phone,
  //   address,
  //   note,
  //   reason,
  //   ListOfProducts: finalProductList,
  //   couponId: req.body.coupon?._id,
  //   subTotal,
  //   total: Number.parseFloat(
  //     subTotal - (subTotal * req.body.coupon?.amount || 0) / 100
  //   ).toFixed(2),
  //   paymentType,
  //   status: paymentType ? "waitPayment" : "placed",
  // };
  // const order = await orderModel.create(dummyOrder);
  // if (!order) {
  //   return next(
  //     new GlobalError({ message: "Fail to create order", statusCode: 400 })
  //   );
  // }

  // //after create order, there are three cases must handel...

  // //1- decrease product stock
  // for (const product of products) {
  //   await productModel.updateOne(
  //     { _id: product.productId },
  //     { $inc: { stock: -parseInt(product.quantity) } }
  //   );
  // }
  // //2- add user to coupon users list
  // if (req.body.coupon) {
  //   await couponModel.updateOne(
  //     { _id: req.body.coupon._id },
  //     { $addToSet: { usedBy: req.user._id } }
  //   );
  // }
  // //3- clear order items from user his cart
  // await delteItemsFromCart(req.user._id ,productsIDs)

  // return res.status(201).json({ message: "Order created successfully", order });

  /***************************************************************************************/
  //The seconad one is convert all items from user's cart to order, and this is its code...
  /***************************************************************************************/

  // const { address, phone, note, reason, couponName, paymentType } = req.body;

  // const cart = await cartModel.findOne({ userId: req.user._id });
  // //check products list of user's cart
  // if (!cart?.ListOfProducts.length) {
  //   return next(new GlobalError({ message: "Empty cart!!", statusCode: 400 }));
  // }
  // req.body.products = cart.ListOfProducts;
  // //first check the coupon conditions if exist!!
  // if (couponName) {
  //   const coupon = await couponModel.findOne({
  //     name: couponName.toLowerCase(),
  //   });
  //   if (!coupon) {
  //     return next(
  //       new GlobalError({ message: "In-valid coupon name", statusCode: 404 })
  //     );
  //   }
  //   if (coupon.expireDate.getTime() < Date.now()) {
  //     return next(
  //       new GlobalError({
  //         message: "The coupon you use is expired",
  //         statusCode: 400,
  //       })
  //     );
  //   }
  //   if (coupon.usedBy.includes(req.user._id)) {
  //     return next(
  //       new GlobalError({
  //         message: "Coupon is used by you before",
  //         statusCode: 400,
  //       })
  //     );
  //   }
  //   req.body.coupon = coupon;
  // }

  // //check product conditions..

  // let finalProductList = [];
  // let productsIDs = [];
  // let subTotal = 0;

  // for (let product of req.body.products) {
  //   const checkProduct = await productModel.findOne({
  //     _id: product.productId,
  //     stock: { $gte: product.quantity },
  //     isDeleted: false,
  //   });
  //   if (!checkProduct) {
  //     return next(
  //       new GlobalError({
  //         message: `Can't add product with ID "${product.productId}" to your order list`,
  //         statusCode: 400,
  //       })
  //     );
  //   }
  //   product = product.toObject();
  //   productsIDs.push(product.productId);
  //   product.name = checkProduct.name;
  //   product.unitPrice = checkProduct.finalPrice;
  //   product.finalPrice = product.unitPrice * product.quantity;
  //   finalProductList.push(product);
  //   subTotal += product.finalPrice;
  // }
  // const dummyOrder = {
  //   userId: req.user._id,
  //   phone,
  //   address,
  //   note,
  //   reason,
  //   ListOfProducts: finalProductList,
  //   couponId: req.body.coupon?._id,
  //   subTotal,
  //   total: Number.parseFloat(
  //     subTotal - (subTotal * req.body.coupon?.amount || 0) / 100
  //   ).toFixed(2),
  //   paymentType,
  //   status: paymentType ? "waitPayment" : "placed",
  // };
  // const order = await orderModel.create(dummyOrder);
  // if (!order) {
  //   return next(
  //     new GlobalError({ message: "Fail to create order", statusCode: 400 })
  //   );
  // }

  // //after create order, there are three cases must handel...

  // //1- decrease product stock
  // for (const product of req.body.products) {
  //   await productModel.updateOne(
  //     { _id: product.productId },
  //     { $inc: { stock: -parseInt(product.quantity) } }
  //   );
  // }
  // //2- add user to coupon users list
  // if (req.body.coupon) {
  //   await couponModel.updateOne(
  //     { _id: req.body.coupon._id },
  //     { $addToSet: { usedBy: req.user._id } }
  //   );
  // }
  // //3- clear order items from user his cart
  // await clearAllItemsFromCart(req.user._id)

  // return res.status(201).json({ message: "Order created successfully", order });

  /*********************************************************************************/
  //The final one is combine between the two senarios above, and this is its code...
  /*********************************************************************************/

  const { address, phone, note, reason, couponName, paymentType } = req.body;
  if (!req.body.products) {
    const cart = await cartModel.findOne({ userId: req.user._id });
    //check products list of user's cart
    if (!cart?.ListOfProducts.length) {
      return next(
        new GlobalError({ message: "Empty cart!!", statusCode: 400 })
      );
    }
    req.body.products = cart.ListOfProducts;
    req.body.isCart = true;
  }

  //first check the coupon conditions if exist!!
  if (couponName) {
    const coupon = await couponModel.findOne({
      name: couponName.toLowerCase(),
    });
    if (!coupon) {
      return next(
        new GlobalError({ message: "In-valid coupon name", statusCode: 404 })
      );
    }
    if (coupon.expireDate.getTime() < Date.now()) {
      return next(
        new GlobalError({
          message: "The coupon you use is expired",
          statusCode: 400,
        })
      );
    }
    if (coupon.usedBy.includes(req.user._id)) {
      return next(
        new GlobalError({
          message: "Coupon is used by you before",
          statusCode: 400,
        })
      );
    }
    req.body.coupon = coupon;
  }

  //check product conditions..

  let finalProductList = [];
  let productsIDs = [];
  let subTotal = 0;

  for (let product of req.body.products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
      isDeleted: false,
    });
    if (!checkProduct) {
      return next(
        new GlobalError({
          message: `Can't add product with ID "${product.productId}" to your order list`,
          statusCode: 400,
        })
      );
    }
    if (req.body.isCart) {
      product = product.toObject();
    }
    productsIDs.push(product.productId);
    product.name = checkProduct.name;
    product.unitPrice = checkProduct.finalPrice;
    product.finalPrice = product.unitPrice * product.quantity;
    finalProductList.push(product);
    subTotal += product.finalPrice;
  }
  const dummyOrder = {
    userId: req.user._id,
    phone,
    address,
    note,
    reason,
    ListOfProducts: finalProductList,
    couponId: req.body.coupon?._id,
    subTotal,
    total: Number.parseFloat(
      subTotal - (subTotal * req.body.coupon?.amount || 0) / 100
    ).toFixed(2),
    paymentType,
    status: paymentType ? "waitPayment" : "placed",
  };
  const order = await orderModel.create(dummyOrder);
  if (!order) {
    return next(
      new GlobalError({ message: "Fail to create order", statusCode: 400 })
    );
  }

  //after create order, there are three cases must handel...

  //1- decrease product stock
  for (const product of req.body.products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: -parseInt(product.quantity) } }
    );
  }
  //2- add user to coupon users list
  if (req.body.coupon) {
    await couponModel.updateOne(
      { _id: req.body.coupon._id },
      { $addToSet: { usedBy: req.user._id } }
    );
  }
  //3- clear order items from user his cart
  if (req.body.isCart) {
    await clearAllItemsFromCart(req.user._id);
  } else {
    await delteItemsFromCart(req.user._id, productsIDs);
  }

  //make payment
  if (order.paymentType == "credit card") {
    const stripe = new Stripe(process.env.STRIPE_KEY);
    if (req.body.coupon) {
      const coupon = await stripe.coupons.create({
        percent_off: req.body.coupon.amount,
        duration: "once",
      });
      req.body.couponId = coupon.id;
    }
    const session = await payment({
      customer_email: req.user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${process.env.SUCCESS_URL}`,
      cancel_url: `${process.env.CANCEL_URL}?orderId=${order._id.toString()}`,
      line_items: order.ListOfProducts.map((product) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.unitPrice * 100, //convert from cent to dollar
          },
          quantity: product.quantity,
        };
      }),
      discounts: req.body.couponId ? [{ coupon: req.body.couponId }] : [],
    });
    return res.status(201).json({
      message: "Order created successfully",
      order,
      session,
      URL: session.url,
    });
  } else {
    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  }
});

export const cancelOrder = catchError(async (req, res, next) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  const order = await orderModel.findOne({
    _id: orderId,
    userId: req.user._id,
  });
  if (
    (order?.status != "placed" && order.paymentType == "cash") ||
    (order?.status != "waitPayment" && order.paymentType == "credit card")
  ) {
    return next(
      new GlobalError({
        message: `Can't cancel your order after it's status been changed to ${order.status}`,
        statusCode: 400,
      })
    );
  }
  const canceledOrder = await orderModel.updateOne(
    { _id: orderId, userId: req.user._id },
    { status: "canceled", reason, updatedBy: req.user._id }
  );
  if (!canceledOrder.matchedCount) {
    return next(
      new GlobalError({
        message: "Failed to cancel your order",
        statusCode: 400,
      })
    );
  }
  //after cancel order must return product quantity to stock & remove user from coupon list..

  //1- add products to stock
  for (const product of order.ListOfProducts) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: parseInt(product.quantity) } }
    );
  }
  //2- add user to coupon users list
  if (order.couponId) {
    await couponModel.updateOne(
      { _id: order.couponId },
      { $pull: { usedBy: req.user._id } }
    );
  }

  return res.status(200).json({ message: "Order canceled successfully" });
});

export const updateOrderStatusByAdmin = catchError(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(
      new GlobalError({ message: "In-valid order id", statusCode: 404 })
    );
  }
  if (order.status == "canceled") {
    return next(
      new GlobalError({
        message: "This order is canceled before, Can't update it's status",
        statusCode: 400,
      })
    );
  }
  const updatedOrder = await orderModel.updateOne(
    { _id: order._id },
    { status, updatedBy: req.user._id }
  );
  if (!updatedOrder) {
    return next(
      new GlobalError({
        message: "Fail to update order status",
        statusCode: 400,
      })
    );
  }
  return res
    .status(200)
    .json({ message: "Order status updated successfully.." });
});

export const webhook = catchError(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const { orderId } = event.data.object.metadata;
  if (event.type != "checkout.session.completed") {
    await orderModel.updateOne({ _id: orderId }, { status: "rejected" });
    return res
      .status(400)
      .json({ message: "Rejected!! payment isn't compeleted.." });
  }
  await orderModel.updateOne({ _id: orderId }, { status: "placed" });
  return res.status(200).json({ message: "Done.." });
});
