import { PrismaClient } from "@prisma/client";
import ErrorHandler from "./errorHandler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

// type User = {
//   email: string;
//   id: string;
//   password: string;
// };

// export interface CustomRequest extends Request {
//   user: User;
// }

// export type MiddlewareFunction<T extends CustomRequest> = (
//   req: T,
//   res: Response,
//   next: NextFunction
// ) => Promise<void>;

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (user) {
      // @ts-ignore
      req.user = user;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const assignUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await prisma.roleType.findUnique({
      // @ts-ignore
      where: { id: req.user.roleTypeId },
    });
    // @ts-ignore
    req.body.role = role.role_type;
    next();
  } catch (error) {
    next(error);
  }
};
