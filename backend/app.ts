import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./src/Routes/userRoutes";
import libraryRoutes from "./src/Routes/libraryRoutes";
import adminRoutes from "./src/Routes/adminRoutes";
import studentRoutes from "./src/Routes/studentRoutes";
import branchRoutes from "./src/Routes/branchRoutes";
import { errorMiddleware } from "./src/middleware/errorHandler";
import functRoutes from "./src/Routes/functRoutes";

export const app = express();
const apiDocuments = YAML.load("./api-docs.yaml");

//applying Middileware
dotenv.config();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocuments));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorMiddleware);

//Rutes
app.use("/api/v1", userRoutes);
app.use("/api/v1", libraryRoutes);
app.use("/api/vi", adminRoutes);
app.use("/api/v1", studentRoutes);
app.use("/api/v1", branchRoutes);
app.use("/api/v1", functRoutes);
