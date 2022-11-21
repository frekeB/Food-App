import express from 'express';
import { AdminRegister,createVendor,superAdmin} from '../controller/adminControlle';
import {auth} from '../middleware/auth';

const router = express.Router();

router.post('/create-admin',auth, AdminRegister);
router.post('/create-super-admin',superAdmin);
router.post('/create-vendor',createVendor);


export default router;