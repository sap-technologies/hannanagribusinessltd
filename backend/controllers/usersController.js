import UserModel from '../models/UserModel.js';

class UsersController {
  // Get all users (admin only)
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAll();
      
      res.json({
        success: true,
        data: users
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get users',
        error: error.message
      });
    }
  }
  
  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.getById(id);
      
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
  
  // Update user (admin only)
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const user = await UserModel.update(id, updates);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  }
  
  // Delete user (admin only)
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Prevent deleting yourself
      if (id == req.user.userId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }
      
      const user = await UserModel.delete(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      });
    }
  }
}

export default UsersController;
