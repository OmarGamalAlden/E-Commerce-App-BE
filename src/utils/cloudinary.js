import cloudinary from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../config/.env") });

cloudinary.v2.config({
  api_key: process.env.api_key,
  cloud_name: process.env.cloud_name,
  api_secret: process.env.api_secret,
  secure: true,
});

export default cloudinary.v2;
