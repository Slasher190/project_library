import express from "express";
import {
  createUser,
  login,
} from "../Controller/userController";
// import {
//   isAuthenticatedUser,
//   assignUserRole,
// } from "../middleware/auth";

const router = express.Router();

router.route("/createUser").post(createUser);
router.route("/login").post(login);

// router.route("/registration/branchAdmin")
// router.route("/registration/superAdmin")

export default router;
