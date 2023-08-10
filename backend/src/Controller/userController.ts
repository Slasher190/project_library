import { Request, Response, NextFunction as Next } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRoleType = async (req: Request, res: Response, next: Next) => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    const roleTypes_ = await prisma.roleType.findMany();
    console.log("DATABASE_URL:", dbUrl, roleTypes_);

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
    res.status(200).json(updatedRoleTypes);
  } catch (error) {
    next(error);
  }
};
