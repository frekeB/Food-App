import express from 'express';
import{Register, verifyUser, Login, resendOTP} from '../controller/userController';

const router = express.Router();

router.post('/signup', Register);
router.post('/verify:signature', verifyUser);
router.post('/login', Login);
router.get('/resend-otp/:signature', resendOTP);



export default router;