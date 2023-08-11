import { Request, Response, NextFunction as Next } from "express";
import { PrismaClient } from "@prisma/client";
import ErrorHandler from "../middleware/errorHandler";
import bcrypt from "bcrypt";
import { sendCookie } from "../Utils/feature";

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

export const createUser = async (req: Request, res: Response, next: Next) => {
  try {
    const {
      email,
      first_name,
      middle_name,
      last_name,
      phone_numbers,
      password,
      role_type, // Assuming you provide an existing roleTypeId
      // avatar,
    } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ErrorHandler("User Already Exists", 400));
    }

    // Create phone numbers and get their IDs
    const createdPhoneNumbers = await Promise.all(
      phone_numbers.map(async (phone: string) => {
        return await prisma.phone.create({
          data: { phone_number: phone },
        });
      })
    );

    // Create the user and associate phone numbers and role
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = await prisma.user.create({
      data: {
        email,
        first_name,
        middle_name,
        last_name,
        phone_numbers: {
          connect: createdPhoneNumbers.map((phone) => ({ id: phone.id })),
        },
        password: hashedPassword,
        role_type: {
          connect: { id: role_type }, // Connect the RoleType using role_type field
        },
        // avatar,
      },
    });

    sendCookie(User, res, "Registered Successfully", 201);
    res.status(201).json(User);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: Next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new ErrorHandler("User Not Found", 400));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(new ErrorHandler("Invalid Username or Password", 400));
    sendCookie(
      user,
      res,
      `Welcome back, ${user.first_name} ${user?.middle_name} ${user.last_name}`,
      200
    );
  } catch (error) {
    next(error);
  }
};
