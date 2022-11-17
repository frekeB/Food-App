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
exports.Register = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const config_1 = require("../config");
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phoneNumber, password, confirm_password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({ error: validateResult.error.details[0].message
            });
        }
        //generate salt
        const salt = yield (0, utils_1.GenerateSalt)();
        //generate password
        const userpassword = yield (0, utils_1.GeneratePassword)(password, salt);
        //generate otp
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        //check if user exist
        const User = yield userModel_1.UserInstance.findOne({
            where: { email: email }
        });
        //create user
        if (!User) {
            let user = yield userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password,
                firstName: '',
                lastName: '',
                salt,
                address: '',
                phoneNumber,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false
            });
            //send OTP to user
            yield (0, utils_1.onRequestOTP)(otp, phoneNumber);
            //send email
            const html = (0, utils_1.emailHTML)(otp);
            yield (0, utils_1.mailSent)(config_1.fromAdminMail, email, config_1.UserSubject, html);
            //check if user exist
            const User = yield userModel_1.UserInstance.findOne({ where: { email: email } });
            //Generate signature
            let signature = yield (0, utils_1.GenarateSignature)({ id: User.id, email: User.email, verified: User.verified });
            return res.status(201).json({
                message: 'User created successfully',
                signature
            });
        }
        return res.status(400).json({
            message: 'User already exist',
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/signup"
        });
    }
});
exports.Register = Register;
//check if user exist
