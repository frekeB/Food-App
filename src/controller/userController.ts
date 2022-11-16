import express,{Request,  Response} from 'express';
import { registerSchema, option, GenerateSalt, GeneratePassword, GenerateOTP, onRequestOTP } from '../utils'
import { UserInstance } from '../model/userModel';
import { v4 as uuidv4 } from 'uuid';




export const Register  = async (req:Request, res:Response) => {
    try{
       const {email, phoneNumber, password,confirm_password} = req.body;
       const uuiduser= uuidv4();

        const validateResult = registerSchema.validate(req.body,option);
        if(validateResult.error){
            return res.status(400).json({error: validateResult.error.details[0].message
            })
        }

        //generate salt
        const salt = await GenerateSalt();
        const userPassword = await GeneratePassword(password, salt);

        //generate password
        const userpassword = await GeneratePassword(password, salt);
        console.log(userpassword)

        //generate otp
        const {otp, expiry} = GenerateOTP();

        //check if user exist
        const User = await UserInstance.findOne({
            where: {email:email} });
        //create user
        if(!User){
            let user = await UserInstance.create({
                id: uuiduser,
                email,
                password,
                firstName: '',
                lastName: '',
                salt,
                address: '',
                phoneNumber,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false
            });
        //send OTP to user
        await onRequestOTP(otp, phoneNumber);

        
            return res.status(201).json({
                message: 'User created successfully',
                 user
                });
            }
        return res.status(400).json({
         message: 'User already exist',
        }); 

    } 
    catch (err){
        
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/signup"
        })
    
        }
    }


