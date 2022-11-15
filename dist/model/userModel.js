"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
//building the model with sequelize
class UserInstance extends sequelize_1.Model {
}
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email address is required"
            },
            isEmail: {
                msg: "Please enter a valid email address"
            }
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "phonenumber is required"
            },
            notEmpty: {
                msg: "Provide a phonenumber"
            },
        }
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            notNull: {
                msg: "OTP is required"
            },
            notEmpty: {
                msg: "Provide a OTP"
            },
        },
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "OTP has expired"
            },
        },
    },
    lng: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    lat: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: "otp is required",
            },
            notEmpty: {
                msg: "provide a otp"
            },
        },
    }
}, {
    sequelize: config_1.db,
    tableName: "user",
});
