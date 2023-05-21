import chalk from "chalk";
import cors from "cors";
import morgan from "morgan";
import connectDB from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import branRouter from "./modules/brand/brand.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import categoryRouter from "./modules/category/category.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import orderRouter from "./modules/order/order.router.js";
import productRouter from "./modules/product/product.router.js";
import reviewsRouter from "./modules/reviews/reviews.router.js";
import subCategoryRouter from "./modules/subcategory/subcategory.router.js";
import userRouter from "./modules/user/user.router.js";
import { GlobalError } from "./utils/errorHandling.js";

export const initApp = (app, express) => {
  //using CORS policy..
  let whitelist = ["http://127.0.0.1:5500", "http://example66.com"]; //F-E access links
  // app.use(async (req, res, next) => {
  //   //handel cors origin cases...
  //   if (!whitelist.includes(req.header("origin"))) {
  //     return next(
  //       new GlobalError({
  //         message: "Not allowed by CORS policy",
  //         statusCode: 403,
  //       })
  //     );
  //   }
  //   for (const origin of whitelist) {
  //     if (req.header("origin") == origin) {
  //       await req.header("Access-Control-Allow-Origin", origin);
  //       break;
  //     }
  //   }
  //   await req.header("Access-Control-Allow-Headers", "*");
  //   await req.header("Access-Control-Allow-Private-Network", "true");
  //   await req.header("Access-Control-Allow-Methods", "*");
  //   console.log("Origin Work");
  //   next();
  // });
  app.use(cors()); //allow access from anywhere...

  //using  Morgan
  if (process.env.MOOD == "dev") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  //converting buffer data
  app.use((req, res, next) => {
    if (req.originalUrl == "/order/webhook") {
      next();
    } else {
      express.json({})(req, res, next);
    }
  });

  //project Routing
  app.get("/", (req, res, next) => {
    return res.status(200).json({ message: "Wellcome to my E-commerce app" });
  });
  app.use(`/auth`, authRouter);
  app.use(`/user`, userRouter);
  app.use(`/product`, productRouter);
  app.use(`/category`, categoryRouter);
  app.use(`/subCategory`, subCategoryRouter);
  app.use(`/reviews`, reviewsRouter);
  app.use(`/coupon`, couponRouter);
  app.use(`/cart`, cartRouter);
  app.use(`/order`, orderRouter);
  app.use(`/brand`, branRouter);

  //any difference routing..
  app.all("*", (req, res, next) => {
    return res
      .status(404)
      .json({ message: "error routing 404, page not found" });
  });

  //Global Error Handling...
  app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const stack = error.stack;
    if (process.env.MOOD == "dev") {
      return res.status(status).json({ message, ErrorStack: stack });
    } else {
      return res.status(status).json({ message });
    }
  });

  //connecting Data Base...
  connectDB();

  //check server condition..
  app.listen(process.env.PORT_NUMBER || 3000, (req, res, next) => {
    console.log(
      chalk.blueBright(
        `server is runinng on port....${process.env.PORT_NUMBER || 3000}`
      )
    );
  });
};
