import { Request, Response, NextFunction as Next } from "express";
import { PrismaClient } from "@prisma/client";
import ErrorHandler from "../middleware/errorHandler";
import { StatusCodes } from "../../constants/statusCode";
import {
  calculateEndDate,
  calculateTotalPrice,
} from "../../constants/functionalities";
import { Roles } from "../../constants/roles";
// import { update } from "lodash";
// import { validationResult } from 'express-validator';
// import bcrypt from "bcrypt";
// import { sendCookie } from "../Utils/feature";

const prisma = new PrismaClient();

interface Student {
  guardian_name: string;
  guardian_phone: string;
  house_flat: string;
  village_colony: string;
  city: string;
  streamId: string;
}

export const registerStudent = async (
  req: Request,
  res: Response,
  next: Next
) => {
  try {
    // @ts-ignore
    if (req.body.role !== Roles.STUDENT) {
      return next(
        new ErrorHandler(
          "You're Not Allowed To Register",
          StatusCodes.FORBIDDEN
        )
      );
    }
    // Destructure data from the request body
    const {
      guardian_name,
      guardian_phone,
      house_flat,
      village_colony,
      city,
      streamId,
    }: Student = req.body;

    // Create the student record using Prisma
    const new_address_ = await prisma.address.create({
      data: {
        house_flat: house_flat,
        village_colony: village_colony,
        city: city,
      },
    });
    const new_phone = await prisma.phone.create({
      data: {
        phone_number: guardian_phone,
      },
    });
    const createdStudent = await prisma.student.create({
      data: {
        guardian_name,
        // @ts-ignore
        user: { connect: { id: req.user.id } },
        guardian_phone: { connect: { id: new_phone.id } },
        // plan: { connect: { id: planId } },
        // membership_plan: { connect: { id: membershipId } },
        stream: { connect: { id: streamId } },
        address: { connect: { id: new_address_.id } },
        // seat: { connect: { id: seatId } },
        // payment: { connect: { id: paymentId } },
        // other properties
      },
    });
    res.status(StatusCodes.OK).json({
      message: "Student registered successfully",
      student: createdStudent,
    });
  } catch (error) {
    next(error);
  }
};

interface PurchaseRequestBody {
  planId: string;
  membershipId: string;
  studentId: string;
  role: string;
  // payment: string;
}

export const selectPlan = async (req: Request, res: Response, next: Next) => {
  try {
    // we will  have to generate token for the time period of plans token expire then dead every thing
    // Input validation using express-validator
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const { planId, membershipId, role }: PurchaseRequestBody = req.body;
    const studentId = req.body.student.id;
    if (role !== Roles.STUDENT) {
      return next(
        new ErrorHandler(
          "You are not allowed to register",
          StatusCodes.FORBIDDEN
        )
      );
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
    });

    if (!plan || !membership) {
      return next(
        new ErrorHandler("Plan or membership not found", StatusCodes.NOT_FOUND)
      );
    }

    const total_price = calculateTotalPrice(plan.price, membership.period);

    const purchase = await prisma.purchase.create({
      data: {
        plan: {
          connect: { id: planId },
        },
        membership: {
          connect: { id: membershipId },
        },
        Student: {
          connect: { id: studentId },
        },
        total_price,
        end_date: calculateEndDate(membership.period),
      },
    });
    const newPurchase = {
      purchaseId: purchase.id,
      plan,
      membership,
      role,
      total: total_price,
      expire: purchase.end_date,
    };
    res.status(StatusCodes.OK).json({
      success: true,
      newPurchase,
      message: `Your prchase for this plan is ${purchase.payment_status}`,
    });
  } catch (error) {
    next(error);
  }
};

// payment
interface paymentGateway {
  purchaseId: string;
  totalAmount: number;
  payModeId: string;
}

export const purchase = async (req: Request, res: Response, next: Next) => {
  try {
    const { purchaseId, totalAmount, payModeId }: paymentGateway = req.body;
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        id: purchaseId,
      },
    });

    if (!existingPurchase) {
      // Handle the case where the Purchase record doesn't exist
      // You may want to return an error response or handle it accordingly.
      return res.status(404).json({ error: "Purchase not found" });
    }

    // Use the existing end_date value in the update
    // const payMode = await prisma.paymentmode.findUnique({
    //   where : {id : payModeId},
    // })
    const newPayment = await prisma.payment.create({
      data: {
        payment_type: {
          connect: { id: payModeId },
        },
        amount:
          typeof totalAmount === "string" ? parseInt(totalAmount) : totalAmount,
      },
    });
    const purchase = await prisma.purchase.upsert({
      where: {
        id: purchaseId,
      },
      update: {
        total_price:
          typeof totalAmount === "string" ? parseInt(totalAmount) : totalAmount,
        end_date: existingPurchase.end_date, // Use the existing end_date
        payment: {
          connect: { id: newPayment.id },
        },
        payment_status: "SUCCESSFULL",
      },
      create: {
        id: purchaseId,
        total_price:
          typeof totalAmount === "string" ? parseInt(totalAmount) : totalAmount,
        end_date: existingPurchase.end_date, // Use the existing end_date
        payment: {
          connect: { id: newPayment.id },
        },
        payment_status: "SUCCESSFULL",
      },
    });

    // const
    res.status(StatusCodes.OK).json({
      success: true,
      amount: purchase.total_price,
      paymentId: newPayment.id,
      message: `Your Payement is successful, Thanks for choosing us`,
    });
  } catch (error) {
    next(error);
  }
};
