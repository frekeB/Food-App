import express, { Request, Response } from "express";
import {
  GenerateOTP,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  mailSent,
  onRequestOTP,
  option,
  adminSchema,
} from "../utils";
import { userAttributes, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";

/** ================================== Register Admin ============================== */

export const AdminRegister = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const { email, phoneNumber, password, firstName, lastName, address } =
      req.body;
    const uuiduser = uuidv4();

    const validateResult = adminSchema.validate(req.body, option);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    //generate salt generate password
    const salt = await GenerateSalt();
    const adminPassword = await GeneratePassword(password, salt);

    //generate otp check if user exist
    const { otp, expiry } = GenerateOTP();
    const Admin = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as userAttributes;

    if (Admin.email === email) {
      return res.status(400).json({
        message: "Email already exist",
      });
    }

    if (Admin.phoneNumber === phoneNumber) {
      return res.status(400).json({
        message: "Phone Number already exists",
      });
    }

    //create Admin
    if (Admin.role === "superadmin") {
      await UserInstance.create({
        id: uuiduser,
        email,
        password: adminPassword,
        firstName,
        lastName,
        salt,
        address,
        phoneNumber,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: true,
        role: "admin",
      });

      //check if user exist
      const Admin = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as userAttributes;

      //Generate signature
      let signature = await GenerateSignature({
        id: Admin.id,
        email: email,
        verified: Admin.verified,
      });

      return res.status(201).json({
        message: "admin created successfully",
        signature,
        verified: Admin.verified,
      });
    }
    return res.status(400).json({
      message: "Admin already exist",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server error",
      route: "/admins/create-admin",
    });
  }
};
/** ================================== Super Admin ============================== */
//check if user exist
export const superAdmin = async (req: JwtPayload, res: Response) => {
  try {
    const { email, phoneNumber, password, firstName, lastName, address } =
      req.body;
    const uuiduser = uuidv4();

    const validateResult = adminSchema.validate(req.body, option);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    //generate salt generate password
    const salt = await GenerateSalt();
    const adminPassword = await GeneratePassword(password, salt);

    //generate otp check if user exist
    const { otp, expiry } = GenerateOTP();
    //check if Admin exist
    const Admin = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as userAttributes;

    //create Admin
    if (!Admin) {
      let User = await UserInstance.create({
        id: uuiduser,
        email,
        password: adminPassword,
        firstName,
        lastName,
        salt,
        address,
        phoneNumber,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: true,
        role: "superadmin",
      });

      //check if admin exist
      const Admin = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as userAttributes;

      //Generate signature
      const signature = await GenerateSignature({
        id: Admin.id,
        email: email,
        verified: Admin.verified,
      });

      return res.status(201).json({
        message: "admin created successfully",
        signature,
        verified: Admin.verified,
      });
    }
    return res.status(400).json({
      message: "Admin already exist",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server error",
      route: "/admins/create-super-admin",
    });
  }
};
