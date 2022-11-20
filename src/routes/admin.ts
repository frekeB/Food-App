import express from 'express';
import { AdminRegister } from '../controller/adminControlle';
import { updateUserProfile } from '../controller/updateProfile';
import{ verifyUser, Login, resendOTP, getAllUsers, getSingleUser} from '../controller/userController';
import {auth} from '../middleware/auth';

const router = express.Router();

router.post('/create-admin',auth, AdminRegister);



export default router;