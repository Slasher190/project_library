import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction as Next } from "express";

const prisma = new PrismaClient();

// get all roles or creatd automatically
export const getRoleType = async (req: Request, res: Response, next: Next) => {
  try {
    const roleTypes_ = await prisma.roleType.findMany();
    if (roleTypes_.length === 0) {
      // Create RoleTypes if not exist
      const roles = await prisma.roleType.createMany({
        data: [
          { role_type: "STUDENT" },
          { role_type: "BRANCH_ADMIN" },
          { role_type: "SUPER_ADMIN" },
        ],
      });
      res.status(200).json({ success: true, roles });
    } else res.status(200).json({ success: true, roleTypes_ });
  } catch (error) {
    next(error);
  }
};

// all plan
export const getAllPlans = async (req: Request, res: Response, next: Next) => {
  try {
    const allPlans = await prisma.plan.findMany();
    if (allPlans.length === 0) {
      const plans = await prisma.plan.createMany({
        data: [
          { plan_name: "HALF DAY", price: 600 },
          { plan_name: "FULL DAY", price: 1000 },
        ],
      });
      res.status(200).json({ success: true, plans });
    } else res.status(200).json({ success: true, allPlans });
  } catch (error) {
    next(error);
  }
};

// membership
export const getAllMembership = async (
  req: Request,
  res: Response,
  next: Next
) => {
  try {
    const allMembership = await prisma.membership.findMany();
    if (allMembership.length === 0) {
      const membership = await prisma.membership.createMany({
        data: [
          { membership_name: "silver", period: 1 },
          { membership_name: "gold", period: 3 },
          { membership_name: "platinum", period: 6 },
          { membership_name: "diamond", period: 12 },
        ],
      });
      res.status(200).json({ success: true, membership });
    } else res.status(200).json({ success: true, allMembership });
  } catch (error) {
    next(error);
  }
};

// stream
export const getAllStream = async (req: Request, res: Response, next: Next) => {
  try {
    const allStream = await prisma.stream.findMany();
    if (allStream.length === 0) {
      const stream = await prisma.stream.createMany({
        data: [
          { stream_name: "UPSC" },
          { stream_name: "JEE-Main/Advance" },
          { stream_name: "NEET" },
          { stream_name: "CA" },
          { stream_name: "SSC" },
          { stream_name: "Other" },
        ],
      });
      res.status(200).json({ success: true, stream });
    } else res.status(200).json({ success: true, allStream });
  } catch (error) {
    next(error);
  }
};

// get all payment method
export const getAllPaymentMethod = async (
  req: Request,
  res: Response,
  next: Next
) => {
  try {
    const allMode = await prisma.paymentMode.findMany();
    if (allMode.length === 0) {
      const mode = await prisma.paymentMode.createMany({
        data: [
          { payment_type: "CREDIT_CARD" },
          { payment_type: "DEBIT_CARD" },
          { payment_type: "CASH" },
          { payment_type: "UPI" },
        ],
      });
      res.status(200).json({ success: true, mode });
    } else res.status(200).json({ success: true, allMode });
  } catch (error) {
    next(error);
  }
};
