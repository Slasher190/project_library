import express from "express";
import {
  purchase,
  registerStudent,
  selectPlan,
} from "../Controller/studentController";
import {
  isAuthenticatedUser,
  assignUserRole,
  studentCheck,
} from "../middleware/auth";

const router = express.Router();

router
  .route("/registration/student")
  .post(isAuthenticatedUser, assignUserRole, registerStudent);
router
  .route("/student/selectPlan")
  .post(isAuthenticatedUser, assignUserRole, studentCheck, selectPlan);
router
  .route("/student/purchase")
  .post(isAuthenticatedUser, assignUserRole, studentCheck, purchase);
export default router;
