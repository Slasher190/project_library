import express from "express";
import {
  getAllMembership,
  getAllPlans,
  getAllStream,
  getRoleType,
  getAllPaymentMethod,
} from "../Controller/functController";

const router = express.Router();

router.route("/getRoleType").get(getRoleType);
router.route("/getAllPlans").get(getAllPlans);
router.route("/getAllMembership").get(getAllMembership);
router.route("/getAllStream").get(getAllStream);
router.route("/getAllPaymentMethod").get(getAllPaymentMethod);

export default router;
