import { DataTypes,Model } from "sequelize";
import {db} from '../config';


export interface userAttributes {
id:string;
email :string;
password:string;
firstName: string;
lastName: string;
salt: string;
address:string;
phoneNumber: string;
otp: number;
otp_expiry: Date;
lng:number;
lat:number;
verified:boolean

}

//building the model with sequelize
 export class UserInstance extends Model <userAttributes>{}

UserInstance.init({
    id: {
        type:DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email address is required"},
                isEmail:{
                    msg: "Please enter a valid email address"
                }
            }
        },
        password: {
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
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false,
            },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: { 
            type: DataTypes.STRING,
           allowNull: false,
              validate: {
                notNull: {
                        msg: "phonenumber is required"
                        },
                        notEmpty:{
                            msg: "Provide a phonenumber"
                        },
           }
        },
        otp: {
            type: DataTypes.NUMBER,
            allowNull: false,
              validate: {
                notNull: {
                            msg: "OTP is required"
                        },
                 notEmpty:{
                            msg: "Provide a OTP"
                        }
              }
            },
              otp_expiry: {
                    type: DataTypes.DATE,
                    allowNull: false,
              validate: {
                notNull: {
                    msg: "OTP is expired"
                }
            }
        },
        lng: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        lat: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        verified: {
            type:DataTypes.BOOLEAN,
            allowNull:false,
            validate:{
                notNull:{
                    msg: "validation is required",
                },
                notEmpty: {
                    msg: "provide validation"
            }
        }
    }


},
{
 sequelize: db,
 tableName: "user",

})