import jwt from "jsonwebtoken";
// import crypto from "crypto";
import { Response } from "express";

export const sendCookie = (
  user: {
    id: string;
    email: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    roleTypeId: string;
    createdAt: Date;
    updatedAt: Date;
  },
  res: Response,
  message: string,
  statusCode: number
) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || ""); // Handle undefined JWT_SECRET
  const cookieMaxAge =
    parseInt(process.env.COOKIE_EXPIRE || "0", 10) * 60 * 60 * 1000;
  const User = {
    email: user.email,
    first_name: user.first_name,
    middle_name: user.middle_name ? user.middle_name : "",
    last_name: user.last_name,
    roleTypeId: user.roleTypeId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: cookieMaxAge,
    })
    .json({
      success: true,
      message,
      token,
      User,
    });
};
