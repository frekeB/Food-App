import { accountSid, authToken, fromAdminPhone, GMAIL_PASS, GMAIL_USER} from '../config';
import nodemailer from 'nodemailer';

export const GenerateOTP = ()=>{
    const otp = Math.floor(1000 + Math.random() * 9000);

    const expiry = new Date();

    expiry.setTime(new Date().getTime() + (30*60*1000));
    
    return {otp, expiry};
}

//
    export const onRequestOTP = async (otp:number, toPhoneNumber:string) => {
    const client = require('twilio')(accountSid, authToken); 
    const response = await client.messages 
    .create({  
        body: `Your OTP is ${otp}`,       
       to: toPhoneNumber,
       from: fromAdminPhone
     }) 
     return response;
}


const  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,    // generated gmail user
        pass: GMAIL_PASS,    //generated gmail password
      },
      tls: {
        rejectUnauthorized: false
        }
})
export const sendEmail = (
        from: string, // sender address
        to: string, // list of receivers
        subject: string, // Subject line
        text:string, // plain text body
        html:string, // html body
      ) => {
        try{
           await transporter.sendMail({
           from:
        });
        }catch(err){
            console.log(err);
        }
      };
