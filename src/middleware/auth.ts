import {NextFunction, Request, Response, } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { APP_SECRET } from '../config';
import { UserInstance } from '../model/userModel';

export const auth = async(req:JwtPayload, res:Response, next:NextFunction) =>{
    try{
    const authorization = req.headers.authorization;

    if(!authorization){
        return res.status(401).json({
           Error:"Kindly login as a user"
        })

    }
    //Bearer errryyyghghhjhj
    const token = authorization.split(" ")[1];
   // const token = authorization.slice(7, authorization.length);
   let verified =jwt.verify(token, APP_SECRET)// App_secret works with jwt
    if(!verified){
        return res.status(401).json({
            Error:"Unauthorized"
        })}
        const {id} = verified as {[key:string]:string}
        

        //find user by id
    const user = await UserInstance.findOne({where:{id:id}});
    if(user){
      return res.status(200).json({
        message:"You have successfully retrieved a user",
        user
      })
    }
    if(!user){
      return res.status(401).json({
        Error:"Invalid Credentials"
      })
    }
    req.user = verified
    next();
    }
    catch(err){
    return res.status(500).json({
        Error:"Unauthorized access",
        route:"users/auth",
    })
}
}