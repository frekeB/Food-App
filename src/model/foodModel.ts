import { DataTypes,Model } from "sequelize";
import sequelize from "sequelize/types/sequelize";
import {db} from '../config';
import { vendor } from "../controller/vendorcontroller";


export interface foodAttributes {
id:string;
name :string;
description: string;
category:string;
foodType: string;
readyTime:Number;
price: string;
rating: number;
vendorId: String

}

//building the model with sequelize
 export class UserInstance extends Model <foodAttributes>{}

foodInstance.init({
    id: {
        type:DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          
            }
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { 
                notNull: {
                    msg: "Password is required"
                },
                notEmpty: {
                    msg: "provide a password "
                },
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        readyTime: {
            type: DataTypes.STRING,
            allowNull: false,
            },

        rating: {
            type: DataTypes.NUMBER
            allowNull: true,
        },
        vendorId:{ 
            type: DataTypes.UUID
           allowNull: true,
        },
      
        },
        price:{
            type: DataTypes.NUMBER,
            allowNull: true,
        }
    {
 sequelize: db,
 tableName: "food",
    }