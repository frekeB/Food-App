import express, { Request, Response } from "express";
import {
  registerSchema,
  option,
  GenerateSalt,
  GeneratePassword,
  GenerateOTP,
  onRequestOTP,
  emailHTML,
  mailSent,
  GenerateSignature,
  verifySignature,
  validatePassword,
  loginSchema,
} from "../utils";
import { userAttributes, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import { fromAdminMail, userSubject } from "../config";
import { jwt } from "twilio";
import { JwtPayload } from "jsonwebtoken";

/** ================================== Register User ============================== */

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber, password, confirm_password } = req.body;
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
    const User = await UserInstance.findOne({
      where: { email: email },
    });
    //create user
    if (!User) {
      let user = await UserInstance.create({
        id: uuiduser,
        email,
        password,
        firstName: "",
        lastName: "",
        salt,
        address: "",
        phoneNumber,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: false,
      });
      //send OTP to user
      await onRequestOTP(otp, phoneNumber);

      //send email
      const html = emailHTML(otp);

      await mailSent(fromAdminMail, email, userSubject, html);

      //check if user exist
      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as userAttributes;

      //Generate signature
      let signature = await GenerateSignature({
        id: User.id,
        email: User.email,
        verified: User.verified,
      });

      return res.status(201).json({
        message:
          "User created successfully check your email for OTP verification",

        signature,
        verified: User.verified,
      });
    }
    return res.status(400).json({
      message: "User already exist",
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      Error: "Internal server error",
      route: "/users/signup",
    });
  }
};
//check if user exist

/** ================================== Verify User ============================== */

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token) as JwtPayload;

    //check if user id exist
    const User = await UserInstance.findOne({
      where:{ email: decode.email},
    }) as unknown as userAttributes;
    if (User) {
      const { otp } = req.body;
      if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
        const updatedUser = (await UserInstance.update(
          {
            verified: true,
          },
          { where: { email: decode.email } }
        )) as unknown as userAttributes;

        //Generate a new signature
        let signature = await GenerateSignature({
          id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified,
        });
        if (updatedUser) {
          const user = (await UserInstance.findOne({
            where: { email: decode.email },
          })) as unknown as userAttributes;

          res.status(200).json({
            message: "you have successfully updated your account",
            signature,
            verified: updatedUser.verified,
          });
        }
        return res.status(400).json({
          message: "OTP is invalid or expired",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      Error: "Internal server error",
      route: "/users/verify",
    });
  }
};

/** ================================== Login User ============================== */
export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        error: validateResult.error.details[0].message,
      });
    }

//confirm user password==using compare
const User = await UserInstance.findOne({
    where: { email: email },
  }) as unknown as userAttributes;
  if(User){
   const validation = await validatePassword (password,User.password,User.salt)
   if(validation){
    //Generate a new signature
    let signature = await GenerateSignature({
        id: User.id,
        email: User.email,
        verified: User.verified,
      });
   //bycrpt:compare(password,User.password
    return res.status(200).json({

        message: "Login successful",
        signature
        });

  }
  res.status(400).json({
    Error:validateResult
  })
}

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      Error: "Internal server error",
      route: "/users/login",
    });
}
};
/** ================================== Resend OTP ============================== */
export const resendOTP= async (req: Request, res: Response) => {
    try {
      const token = req.params.signature;
      const decode = (await verifySignature(token)) as JwtPayload;
      const  user = (await UserInstance.findOne({
        where: { email: decode.email }})) as unknown as userAttributes;


        if (user) { 
          const { otp, expiry } = GenerateOTP();
          const updatedUser = (await UserInstance.update(
            {
              otp,
              otp_expiry: expiry,
            },
            { where: { email: decode.email } }
          )) as unknown as userAttributes;

            if (updatedUser) {
                const user = (await UserInstance.findOne({
                    where: { email: decode.email },})) as unknown as userAttributes;
                    
                //send OTP to user
                await onRequestOTP(otp, user.phoneNumber);

                //send email
                const html = emailHTML(otp);
                await mailSent(fromAdminMail, user.email, userSubject, html);
                
                return res.status(200).json({
                message: "OTP resent successfully send to your emailand phoneNumber",
                });
            }
            }
            //error sending OTP
            return res.status(400).json({
                message: "Error sending OTP",
                });

    } catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/resend-otp/:signature",
        });
        }
    }
    