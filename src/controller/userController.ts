import express,{Request,  Response} from 'express';
export const Register  = (req:Request, res:Response) => {
    try{
        return res.status(200).json({message: "Successful"})
    } catch (error){
        console.log(error)

    }
}