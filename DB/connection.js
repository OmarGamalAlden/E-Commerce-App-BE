import chalk from "chalk";
import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB_LINK_CONNECTION)
    .then(() => {
      console.log(chalk.bgCyan(`DB connected successfully...`));
    })
    .catch((err) => {
      console.log(chalk.bgRed(`fail to connect DB, error: ${err}`));
    });
};
export default connectDB;
