"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleUser = exports.getAllUsers = exports.resendOTP = exports.Login = exports.verifyUser = exports.Register = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const config_1 = require("../config");
/** ================================== Register User ============================== */
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phoneNumber, password, confirm_password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res
                .status(400)
                .json({ error: validateResult.error.details[0].message });
        }
        //generate salt
        const salt = yield (0, utils_1.GenerateSalt)();
        //generate password
        const userpassword = yield (0, utils_1.GeneratePassword)(password, salt);
        //generate otp
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        //check if user exist
        const User = yield userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        //create user
        if (!User) {
            let user = yield userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password,
                firstName: "",
                lastName: "",
                salt,
                address: "",
                phoneNumber,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "admin",
            });
            //send OTP to user
            yield (0, utils_1.onRequestOTP)(otp, phoneNumber);
            //send email
            const html = (0, utils_1.emailHTML)(otp);
            yield (0, utils_1.mailSent)(config_1.fromAdminMail, email, config_1.userSubject, html);
            //check if user exist
            const User = (yield userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate signature
            let signature = yield (0, utils_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            return res.status(201).json({
                message: "User created successfully check your email for OTP verification",
                signature,
                verified: User.verified,
            });
        }
        return res.status(400).json({
            message: "User already exist",
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/signup",
        });
    }
});
exports.Register = Register;
//check if user exist
/** ================================== Verify User ============================== */
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = yield (0, utils_1.verifySignature)(token);
        //check if user id exist
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            const { otp } = req.body;
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updatedUser = (yield userModel_1.UserInstance.update({
                    verified: true,
                }, { where: { email: decode.email } }));
                //Generate a new signature
                let signature = yield (0, utils_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                if (updatedUser) {
                    const user = (yield userModel_1.UserInstance.findOne({
                        where: { email: decode.email },
                    }));
                    return res.status(200).json({
                        message: "you have successfully updated your account",
                        signature,
                        verified: user.verified,
                    });
                }
                return res.status(400).json({
                    message: "OTP is invalid or expired",
                });
            }
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/verify",
        });
    }
});
exports.verifyUser = verifyUser;
/** ================================== Login User ============================== */
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            res.status(400).json({
                error: validateResult.error.details[0].message,
            });
        }
        //confirm user password==using compare
        const User = (yield userModel_1.UserInstance.findOne({ where: { email: email } }));
        if (User.verified === true) {
            const validation = yield (0, utils_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                //Generate a new signature
                let signature = yield (0, utils_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                //bycrpt:compare(password,User.password
                return res.status(200).json({
                    message: "Login successful",
                    signature,
                    email: User.email,
                    verified: User.verified,
                    role: User.role,
                });
            }
            return res.status(400).json({
                Error: "Invalid credentials",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/login",
        });
    }
});
exports.Login = Login;
/** ================================== Resend OTP ============================== **/
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = (yield (0, utils_1.verifySignature)(token));
        const user = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (user) {
            const { otp, expiry } = (0, utils_1.GenerateOTP)();
            const updatedUser = (yield userModel_1.UserInstance.update({
                otp,
                otp_expiry: expiry,
            }, { where: { email: decode.email } }));
            if (updatedUser) {
                const user = (yield userModel_1.UserInstance.findOne({
                    where: { email: decode.email },
                }));
                //send OTP to user
                yield (0, utils_1.onRequestOTP)(otp, user.phoneNumber);
                //send email
                const html = (0, utils_1.emailHTML)(otp);
                yield (0, utils_1.mailSent)(config_1.fromAdminMail, user.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP resent successfully send to your emailand phoneNumber",
                });
            }
        }
        //error sending OTP
        return res.status(400).json({
            message: "Error sending OTP",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/resend-otp/:signature",
        });
    }
});
exports.resendOTP = resendOTP;
/** ================================== User Profile ============================== **/
// get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const users = await UserInstance.findAll();
        // return res.status(200).json({
        //   message: "You have succesfull retrieved all users",
        //   users
        /** To target limit and offset**/
        const limit = req.query.limit;
        const users = yield userModel_1.UserInstance.findAndCountAll({
            limit: limit,
        });
        return res.status(200).json({
            message: "You have succesfull retrieved all users",
            Count: users.count,
            Users: users.rows
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            route: "users/get-all-users",
        });
    }
});
exports.getAllUsers = getAllUsers;
//get single users
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const id = req.params.id;
        const id = req.user.id;
        //find user by id
        const user = yield userModel_1.UserInstance.findOne({ where: { id: id } });
        if (user) {
            return res.status(200).json({
                message: "You have successfully retrieved a user",
                user
            });
        }
        return res.status(400).json({
            message: "User not found"
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            route: "users/get-user",
        });
    }
});
exports.getSingleUser = getSingleUser;
/** ================================== Query params ============================== **/
//request.query(?) comes from the question mark in the url. 
// anything that comes after the question mark must come in the form of key value pair e.g limit=10, sort=blues
//request.params comes from the colon in the url. anything that comes after the colon must come in the form of a string e.g /users/1
//request.body is used to get data from the body of the request. This is used when you want to send data to the server
