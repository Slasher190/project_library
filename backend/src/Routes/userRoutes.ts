import express from "express";
import { createUser, getRoleType, login } from "../Controller/userController";

const router = express.Router();

router.route("/getRoleType").get(getRoleType);
router.route("/createUser").post(createUser);
router.route("/login").post(login);

export default router;