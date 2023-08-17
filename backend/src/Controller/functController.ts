import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction as Next } from "express";

const prisma = new PrismaClient();

// get all roles or creatd automatically
export const getRoleType = async (req: Request, res: Response, next: Next) => {
  try {
    const roleTypes_ = await prisma.roleType.findMany();
    if (roleTypes_.length === 0) {
      // Create RoleTypes if not exist
      await prisma.roleType.createMany({
        data: [
          { role_type: "STUDENT" },
          { role_type: "BRANCH_ADMIN" },
          { role_type: "SUPER_ADMIN" },
        ],
      });
    }

    const updatedRoleTypes = await prisma.roleType.findMany();
    res.status(200).json({ success: true, updatedRoleTypes });
  } catch (error) {
    next(error);
  }
};

// all plan
export const getAllPlans = async (req: Request, res: Response, next: Next) => {
  try {
    const allPlans = await prisma.plan.findMany();
    if (allPlans.length === 0) {
      await prisma.plan.createMany({
        data: [{ plan_name: "HALF DAY" }, { plan_name: "FULL DAY" }],
      });
    }
    const updatedPlanTypes = await prisma.plan.findMany();
    res.status(200).json({ success: true, updatedPlanTypes });
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
      await prisma.membership.createMany({
        data: [
          { membership_name: "1" },
          { membership_name: "3" },
          { membership_name: "6" },
          { membership_name: "12" },
        ],
      });
    }
    const updatedMembership = await prisma.membership.findMany();
    res.status(200).json({ success: true, updatedMembership });
  } catch (error) {
    next(error);
  }
};
