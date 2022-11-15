import express from 'express';
import {Register } from '../controller/userController';

const router = express.Router();

router.post('/sign', Register);

export default router;