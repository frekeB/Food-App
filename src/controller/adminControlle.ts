import express, {Request, Response } from "express";
import { emailHTML, GenerateOTP, GeneratePassword, GenerateSalt, GenerateSignature, mailSent, onRequestOTP, option, registerSchema } from "../utils";
import { userAttributes, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import { fromAdminMail, userSubject } from "../config";
import { jwt } from "twilio";
import { JwtPayload } from "jsonwebtoken";
import { options } from "joi";

/** ================================== Register User ============================== */

export const AdminRegister = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber, password, firstName, lastName} = req.body;
    const uuiduser = uuidv4();

    const validateResult = registerSchema.validate(req.body, option);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ error: validateResult.error.details[0].message });
    }

    //generate salt
    const salt = await GenerateSalt();

    //generate password
    const userpassword = await GeneratePassword(password, salt);

    //generate otp
    const { otp, expiry } = GenerateOTP();

    //check if user exist
    const Admin = await UserInstance.findOne({
      where: { email: email },
    });
    const hashedPassword= await GeneratePassword(password, salt);
    //create Admin
    if (!Admin) {
      let user = await UserInstance.create({
        id: uuiduser,
        email,
        password:hashedPassword,
        firstName: "",
        lastName: "",
        salt,
        address: "",
        phoneNumber,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: true,
        role: "superadmin",
      })as unknown as UserInstance;


      //check if user exist
      const Admin = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as userAttributes;

      //Generate signature
      let signature = await GenerateSignature({
        id: Admin.id,
        email: Admin.email,
        verified: Admin.verified,
      });

      return res.status(201).json({
        message:
          "admin created successfully check your email for OTP verification",

        signature,
        verified: Admin.verified,
      });
    }
    return res.status(400).json({
      message: "Admin already exist",
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      Error: "Internal server error",
      route: "/admins/signup",
    });
  }
};
//check if user exist