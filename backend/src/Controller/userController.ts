import { Request, Response, NextFunction as Next } from "express";
import { PrismaClient } from "@prisma/client";
import ErrorHandler from "../middleware/errorHandler";
import bcrypt from "bcrypt";
import { sendCookie } from "../Utils/feature";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response, next: Next) => {
  try {
    const {
      email,
      first_name,
      middle_name,
      last_name,
      phone_numbers,
      password,
      role_type,
    } = req.body;

    if (!req.files || !req.files.avatar) {
      return next(new ErrorHandler("Please upload your Avatar", 400));
    }

    const avatars = Array.isArray(req.files.avatar)
      ? req.files.avatar
      : [req.files.avatar];

    // console.log(email, " data ");
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new ErrorHandler("User Already Exists", 400));
    }

    const uploadedResults: UploadApiResponse[] = [];

    // Upload the avatar images to Cloudinary
    const config = {
      folder: "avatars",
    };

    for (const avatar of avatars) {
      const buffer = avatar.data;

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(config, (error, result) => {
            if (error) {
              reject(error);
            } else {
              if (result) resolve(result);
            }
          })
          .end(buffer);
      });
      if (result) uploadedResults.push(result);
    }
    // Create phone numbers and get their IDs
    const avatar_ = await prisma.avatar.create({
      data: {
        cloudinary_id: uploadedResults[0].public_id,
        url: uploadedResults[0].secure_url,
      },
    });
    const createdPhoneNumbers = await Promise.all(
      phone_numbers.split(",").map(async (phone: string) => {
        return await prisma.phone.create({
          data: { phone_number: phone },
        });
      })
    );

    // Create the user and associate phone numbers and role
    const hashedPassword = await bcrypt.hash(password, 10);
    if (avatar_ && avatar_.id) {
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
            connect: { id: role_type },
          },
          avatar: {
            connect: { id: avatar_.id },
          },
          // Store the Cloudinary result URLs in your user model
          // avatarUrls: uploadedResults.map((result) => result.url),
        },
      });
      // User.url = avatar_.url;
      const userWithUrl = {
        ...User,
        url: avatar_?.url,
      };
      sendCookie(userWithUrl, res, "Registered Successfully", 201);
      // res.status(201).json(User);
    }
  } catch (error) {
    next(error);
  }
};

// export const createUser1 = async (req: Request, res: Response, next: Next) => {
//   try {
//     const {
//       email,
//       first_name,
//       middle_name,
//       last_name,
//       phone_numbers,
//       password,
//       role_type, // Assuming you provide an existing roleTypeId
//       // avatar,
//     } = req.body;

//     if (!req.files) {
//       return next(new ErrorHandler("No files uploaded", 400));
//     }
//     const avatar = req.files.avatar;
//     // Check if the user already exists
//     if (!avatar) {
//       return next(new ErrorHandler("Please upload your Avatar", 400));
//     }
//     console.log(avatar, " AVATAR ");
//     console.log(req.body, " data ");

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (existingUser) {
//       return next(new ErrorHandler("User Already Exists", 400));
//     }
//     // Upload the avatar image to Cloudinary
//     const buffer = avatar.data;
//     const config = {
//       folder: "avatars",
//     };

//     const result: UploadApiResponse = await cloudinary.uploader.upload_stream(
//       config,
//       buffer
//     );
//     // Create phone numbers and get their IDs
//     const createdPhoneNumbers = await Promise.all(
//       // only for development purposes
//       phone_numbers.split(",").map(async (phone: string) => {
//         return await prisma.phone.create({
//           data: { phone_number: phone },
//         });
//       })
//     );
//     // const createdPhoneNumbers = await Promise.all(
//     //   phone_numbers.map(async (phone: string) => {
//     //     return await prisma.phone.create({
//     //       data: { phone_number: phone },
//     //     });
//     //   })
//     // );

//     // Create the user and associate phone numbers and role
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const User = await prisma.user.create({
//       data: {
//         email,
//         first_name,
//         middle_name,
//         last_name,
//         phone_numbers: {
//           connect: createdPhoneNumbers.map((phone) => ({ id: phone.id })),
//         },
//         password: hashedPassword,
//         role_type: {
//           connect: { id: role_type }, // Connect the RoleType using role_type field
//         },
//         // avatarId: String(Avatar),
//       },
//     });

//     sendCookie(User, res, "Registered Successfully", 201);
//     res.status(201).json(User);
//   } catch (error) {
//     next(error);
//   }
// };

export const login = async (req: Request, res: Response, next: Next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return next(new ErrorHandler("User Not Found", 400));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(new ErrorHandler("Invalid Username or Password", 400));
    const avatar = await prisma.avatar.findUnique({
      where: { id: user.avatarId },
    });
    const userWithUrl = {
      ...user,
      url: avatar?.url,
    };
    sendCookie(
      userWithUrl,
      res,
      `Welcome back, ${user?.first_name} ${user?.middle_name} ${user?.last_name}`,
      200
    );
  } catch (error) {
    next(error);
  }
};

