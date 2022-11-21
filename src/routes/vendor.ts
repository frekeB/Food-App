import express from "express";
import { authVendor} from "../middleware";
import {

} from "../controller/vendorcontroller";
import { auth } from "../middleware/auth";


const router = express.Router()
    router.post('/login', vendorLogin)
    router.post('/create-food', authVendor, createFood)




    export default router;



