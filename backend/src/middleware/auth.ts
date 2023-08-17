import { PrismaClient } from "@prisma/client";
import ErrorHandler from "./errorHandler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }
    const decocde = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decocde.id },
    });
  } catch (error) {
    next();
  }
};
