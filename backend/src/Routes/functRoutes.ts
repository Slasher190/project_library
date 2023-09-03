import express from "express";
import {
  getAllMembership,
  getAllPlans,
  getAllStream,
  getRoleType,
} from "../Controller/functController";

const router = express.Router();

router.route("/getRoleType").get(getRoleType);
router.route("/getAllPlans").get(getAllPlans);
router.route("/getAllMembership").get(getAllMembership);
router.route("/getAllStream").get(getAllStream);

export default router;
