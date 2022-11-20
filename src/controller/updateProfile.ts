import express, {  Response } from "express";
import { userAttributes, UserInstance } from "../model/userModel";
import { JwtPayload } from "jsonwebtoken";
import{option, updateSchema, validatePassword,} from "../utils";

export const updateUserProfile = async (req: JwtPayload, res: Response) => {

    try{
        const id = req.user.id
        const {firstName, lastName, address, phoneNumber} = req.body;
        const validateResult = updateSchema.validate(req.body, option);
        if(validateResult.error){
            return res.status(400).json({
                error:validateResult.error.details[0].message
            })
        }
        const user = await UserInstance.findOne({where:{id:id}});
        if(!user){
            return res.status(400).json({
                error:"User not found"
            });
            const update = await UserInstance.update({
                firstName,
                lastName,
                phoneNumber,
                address
                
            }, {where:{id:id}})
            if(update){
                return res.status(200).json({
                    message:"You have successfully updated your profile",
                    update
                })
            }
        }
        if(!user){
            return res.status(404).json({
                Error:"User not found"
            })
        }
    
        let User = await UserInstance.findOne({
            where:{email:email}
        })as unknown as userAttributes;
        if(!User){
            return res.status(404).json({ 
                Error:"you are not allowed to perform this action"; 
            });
        }
        const updatedUser = await UserInstance.update({
            firstName,
            lastName,
            address,
            phoneNumber,
        },
        {where:{id:id}}
     )

        if(updatedUser){
            const user = await UserInstance.findOne({where:{id:id}})as unknown as userAttributes;
            return res.status(200).json({
                ...User,
                message:"You have successfully updated your profile";
                })
            }
        }else(
            res.status(400).json({
                Error:"Eror finding user"
                route:"/users/update"
            })
        )
        if(!updatedUser){
    }catch(err){
        res.status(500).json({
            Error:"Internal server error",
            route:"/users/update"
    })
}
};