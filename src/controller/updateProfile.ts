import express, { Response } from "express";
import { userAttributes, UserInstance } from "../model/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { option, updateSchema, validatePassword } from "../utils";

export const updateUserProfile = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const { firstName, lastName, address, phoneNumber } = req.body;
    const validateResult = updateSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        error: validateResult.error.details[0].message,
      });
    }
    const user = await UserInstance.findOne({ where: { id: id } });

    if (!user) {
      return res.status(400).json({
        message: "You are not authorized to update this profile",
      });
    }
      const updatedUser = await UserInstance.update(
        {
          firstName,
          lastName,
          phoneNumber,
          address,
        },
        { where: { id: id } }
      )as unknown as userAttributes;
    
    if (updatedUser) {
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as userAttributes;
      return res.status(200).json({
        ...User,
        message: "You have successfully updated your profile",
        User,
      });
    }
    return res.status(400).json({
      message: "Error occcured",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server error",
      route: "/users/update-profile",
    });
  }
};
