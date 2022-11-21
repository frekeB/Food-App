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
  vendorSchema,
  loginSchema,
  validatePassword,
} from "../utils";
import { userAttributes, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { VendorAttributes, vendorInstance } from "../model/vendorModel";
import { vendor } from "./vendorcontroller";

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
/** ================================== Create Vendor ============================== */
export const createVendor = async (req: JwtPayload, res: Response) => {
  try {
    const id = req
    const { email, phoneNumber, password, ownerName, name, address,pincode } =
    req.body;
  const uuidvendor = uuidv4();

    const validateResult = vendorSchema.validate(req.body, option);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

      //generate salt generate password
      const salt = await GenerateSalt();
      const vendorPassword = await GeneratePassword(password, salt);


      //check if vendor exist
      const vendor = (await vendorInstance.findOne({
        where: { email: email },
      })) as unknown as userAttributes;

      const Admin = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as userAttributes;

      if (Admin.role === 'admin'|| Admin.role === 'superadmin') {
        return res.status(400).json({
          message: "Email already exist",
        });
      }

      if(!vendor){
        const createVendor = await vendorInstance.create({
          id:uuidvendor,
          email, 
          phoneNumber,
          password:vendorPassword,
          ownerName, 
          name, 
           address,
          pincode,
          salt,
          role:vendor,
          servicAvailable:false,
          rating:0

        })
        return res.status(201).json({
          message: "admin created successfully",
          createVendor
      })
    }

  } catch(err){
    res.status(500).json({
      Error: "Internal server error",
      route: "/admins/create-admin",
    });
}
  }

  /** ================================== Create Vendor ============================== */
  export const vendorLogin= async (req: JwtPayload, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const validateResult = loginSchema.validate(req.body, option);
      if (validateResult.error) {
        res.status(400).json({
          error: validateResult.error.details[0].message,
        });
      }
  
      //confirm user password==using compare
      const vendor = (await UserInstance.findOne({where: { email: email }})) as unknown as VendorAttributes;
      if (vendor) {
        const validation = await validatePassword(password, vendor.password, vendor.salt);
      
        if (validation){
          //Generate a new signature
          let signature = await GenerateSignature({
            id: vendor.id,
            email: vendor.email,
            verified: vendor.servicAvailable
            
          });
          //bycrpt:compare(password,User.password
          return res.status(200).json({
            message: "Login successful",
            signature,
            email: vendor.email,
            serviceAvailable: vendor.servicAvailable,
            role: vendor.role,
          });
        }
      return  res.status(400).json({
          Error:"Invalid credentials",
        });
      }
    } catch (err) {
      res.status(500).json({
        Error: "Internal server error",
        route: "/users/login",
      });
    }
  };
  