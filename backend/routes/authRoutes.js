import express from 'express';
import AuthController from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', verifyToken, AuthController.getCurrentUser);
router.post('/change-password', verifyToken, AuthController.changePassword);

// Admin only - register new users
router.post('/register', verifyToken, AuthController.register);

export default router;
