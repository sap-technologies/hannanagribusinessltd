import UserModel from '../models/UserModel.js';
import { generateToken } from '../middleware/auth.js';

class AuthController {
  // Register new user (admin only)
  static async register(req, res) {
    try {
      const { email, password, fullName, role } = req.body;
      
      // Validation
      if (!email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and full name are required'
        });
      }
      
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }
      
      // Create user
      const user = await UserModel.create(email, password, fullName, role);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
      
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }
  
  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
      
      // Authenticate user
      const user = await UserModel.login(email, password);
      
      // Generate token
      const token = generateToken(user.userId, user.email, user.role, user.fullName);
      
      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });
      
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // Logout user
  static async logout(req, res) {
    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logout successful'
    });
  }
  
  // Get current user
  static async getCurrentUser(req, res) {
    try {
      const user = await UserModel.getById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get user',
        error: error.message
      });
    }
  }
  
  // Change password
  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Old password and new password are required'
        });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        });
      }
      
      await UserModel.changePassword(req.user.userId, oldPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default AuthController;
