import express from "express";
import { getRoleType } from "../Controller/userController";

const router = express.Router();

router.route("/getRoleType").get(getRoleType);

export default router;