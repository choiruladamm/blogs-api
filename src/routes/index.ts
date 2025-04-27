import { Router } from 'express';
import authRouter from '../modules/auth/auth.controller';

const router = Router();

// Grouped routes
router.use('/auth', authRouter);

export default router;
