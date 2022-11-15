import express from 'express';
import{Register} from '../controller/userController';

const router = express.Router();

router.post('/signup', Register);

export default router;