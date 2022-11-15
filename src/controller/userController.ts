import express,{Request,  Response} from 'express';
import { registerSchema, option } from '../utils/utility';
import { GenerateSalt } from '../utils/utility';
import { GeneratePassword } from '../utils/utility';


export const Register  = async (req:Request, res:Response) => {
    try{
       const {email, phoneNumber, password,confirm_password} = req.body;

        const validateResult = registerSchema.validate(req.body,option);
        if(validateResult.error){
            return res.status(400).json({error: validateResult.error.details[0].message
            })
        }

        //generate salt
        const salt = await GenerateSalt();
        //generate password
        const userpassword = await GeneratePassword(password, salt);
        console.log(userpassword)

    } catch (err){
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/signup"
        })
    
        }
    }


