import express from "express";
import {
  getAllMembership,
  getAllPlans,
  getRoleType,
} from "../Controller/functController";

const router = express.Router();

router.route("/getRoleType").get(getRoleType);
router.route("/getAllPlans").get(getAllPlans);
router.route("/getAllMembership").get(getAllMembership);

export default router;
