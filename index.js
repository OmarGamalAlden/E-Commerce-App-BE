import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { initApp } from "./src/app.router.js";

//set directory dirname for config file...
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });

const app = express();
app.set("case sensitive routing", true);
initApp(app, express);
