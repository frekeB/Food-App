import {
  accountSid,
  authToken,
  fromAdminPhone,
  GMAIL_PASS,
  GMAIL_USER,
  fromAdminMail,
  userSubject,
} from "../config";
import nodemailer from "nodemailer";
import { response } from "express";

export const GenerateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  const expiry = new Date();

  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

//
export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const client = require("twilio")(accountSid, authToken);
  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    to: toPhoneNumber,
    from: fromAdminPhone,
  });
  return response;
};

let transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER, // generated gmail user
    pass: GMAIL_PASS, //generated gmail password
  },
  tls: {
    rejectUnauthorized: false,
  },
});


export const mailSent = async (
  from: string, // sender address
  to: string, // list of receivers
  subject: string, // Subject line
  html: string
) => {
  try {
    const response = await transport.sendMail({
      from: fromAdminMail,
      to,
      subject:userSubject,
      html,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}

export const emailHTML = (otp: number) => {
  let response = `
         <div style= "max-width:700px; margin:auto;
          border:10px solid #ddd; padding:50px 20px; 
          font-size:110%; ">
          <h2 style = "text-align: center;
          text-transformation:uppercase;
          color:teal;">
          Welcome to Freke store
          </h2>
          <p> Hi there, your otp ${otp}</p>
          </div>`;
  return response;
};
