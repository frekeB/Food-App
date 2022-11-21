import { DataTypes,Model } from "sequelize";
import {db} from '../config';


export interface VendorAttributes {
id:string;
name: string;
ownerName: string;
phoneNumber: string;
email :string;
password:string;
address:string;
pincode:string;
salt: string;
servicAvailable: boolean;
rating:number;
role:string;
// otp: number;
// otp_expiry: Date;
// lng:number;
// lat:number;
// verified:boolean
// role:string;

}

//building the model with sequelize
 export class vendorInstance extends Model <VendorAttributes>{}

 vendorInstance.init({
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
        ownerName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        name:{
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
        pincode: {
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
            
        rating:{
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        role: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        servicAvailable:{
            type: DataTypes.BOOLEAN,
            allowNull: false

    }


},
{
 sequelize: db,
 tableName: 'vendor'

})
