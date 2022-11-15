import express from 'express';
import {Register } from '../controller/userController';

const router = express.Router();

router.get('/sign', Register);

export default router;