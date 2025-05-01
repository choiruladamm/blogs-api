import { Router } from 'express';
import authRouter from '../modules/auth/auth.controller';

const router = Router();

router.use('/auth', authRouter);

export default router;
