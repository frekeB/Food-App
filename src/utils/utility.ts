import Joi from 'joi';
import bcrypt from 'bcrypt';
import { AuthPayload } from '../interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { APP_SECRET } from '../config';
;


export const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    phoneNumber: Joi.string().required(),
    confirm_password: Joi.any().equal(Joi.ref('password'))
    .required().label('Confirm password').messages({'any.only': '{{#label}} does not match'}),
    
});

export const option ={
    abortEarly: false,
    errors: {  
        wrap: {  
        label: '',
}}
 };



 export const GenerateSalt = async() => {
    return await bcrypt.genSalt()
 }

 export const GeneratePassword = async(password:string, salt:string) => {
    return await bcrypt.hash(password, salt);
 }

 //generate signature
 export const GenerateSignature = async(payload:AuthPayload) =>{
    return jwt.sign(payload, APP_SECRET, {expiresIn: '1d'});

 }

 export const verifySignature = async (signature:string)=>{
   return jwt.verify(signature,APP_SECRET,)as JwtPayload
 }
 
 export const loginSchema = Joi.object().keys({
   email: Joi.string().required(),
   password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
 });

 export const validatePassword = async (enteredPass:string, savedPassword:string, salt:string) =>{
   return await  GeneratePassword(enteredPass, salt)==savedPassword
 }


 export const updateSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  
});

export const adminSchema = Joi.object().keys({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
})
export const vendorSchema = Joi.object().keys({
  email: Joi.string().required(),
  Name: Joi.string().required(),
  ownerName: Joi.string().required(),
  pincode: Joi.string().required(),
  password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
})