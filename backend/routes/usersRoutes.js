import express from 'express';
import UsersController from '../controllers/usersController.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(verifyToken);
router.use(adminOnly);

router.get('/', UsersController.getAllUsers);
router.get('/:id', UsersController.getUserById);
router.put('/:id', UsersController.updateUser);
router.delete('/:id', UsersController.deleteUser);

export default router;
