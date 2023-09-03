import express from "express";
import {
  registerStudent,
} from "../Controller/studentController";
import {
  isAuthenticatedUser,
  assignUserRole,
} from "../middleware/auth";

const router = express.Router();

router.route("/student/purchase").post();
router
  .route("/registration/student")
  .post(
    isAuthenticatedUser,
    assignUserRole,
    registerStudent
  );
export default router;
