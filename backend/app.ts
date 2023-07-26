import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import dotenv from "dotenv";

export const app = express();
const apiDocuments = YAML.load("./api-docs.yaml");

dotenv.config()
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocuments));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
