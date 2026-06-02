import { Router } from 'express';
import { login, logout, refresh } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/refresh', refresh);

export default router;
