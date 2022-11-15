"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const Register = (req, res) => {
    try {
        return res.status(200).json({ message: "Successful" });
    }
    catch (error) {
        console.log(error);
    }
};
exports.Register = Register;
