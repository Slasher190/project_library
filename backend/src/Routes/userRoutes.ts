import express from "express";
import { createUser, login } from "../Controller/userController";

const router = express.Router();

router.route("/createUser").post(createUser);
router.route("/login").post(login);

export default router;