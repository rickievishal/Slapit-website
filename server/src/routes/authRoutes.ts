import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/google', authController.googleLogin);
router.get('/me', authenticate, authController.getMe);

export default router;
