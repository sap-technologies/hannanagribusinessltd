import sql from '../db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

class UserModel {
  // Register new user
  static async create(email, password, fullName, role = 'staff') {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const [user] = await sql`
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES (${email}, ${passwordHash}, ${fullName}, ${role})
      RETURNING user_id, email, full_name, role, is_active, profile_photo, created_at
    `;
    
    return user;
  }
  
  // Login user
  static async login(email, password) {
    const [user] = await sql`
      SELECT user_id, email, password_hash, full_name, role, is_active, profile_photo
      FROM users
      WHERE email = ${email}
    `;
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    if (!user.is_active) {
      throw new Error('Account is inactive. Contact administrator.');
    }
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }
    
    // Update last login
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP
      WHERE user_id = ${user.user_id}
    `;
    
    return {
      userId: user.user_id,
      email: user.email,
      fullName: user.full_name,
      profilePhoto: user.profile_photo,
      role: user.role
    };
  }
  
  // Get user by ID
  static async getById(userId) {
    const [user] = await sql`
      SELECT user_id, email, full_name, role, is_active, profile_photo, last_login, created_at
      FROM users
      WHERE user_id = ${userId}
    `;
    
    return user;
  }
  
  // Get all users (admin only)
  static async getAll() {
    return await sql`
      SELECT user_id, email, full_name, role, is_active, profile_photo, last_login, created_at
      FROM users
      ORDER BY created_at DESC
    `;
  }
  
  // Update user
  static async update(userId, updates) {
    const { fullName, role, isActive } = updates;
    
    const [user] = await sql`
      UPDATE users
      SET 
        full_name = COALESCE(${fullName}, full_name),
        role = COALESCE(${role}, role),
        is_active = COALESCE(${isActive}, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
      RETURNING user_id, email, full_name, role, is_active, profile_photo
    `;
    
    return user;
  }
  
  // Change password
  static async changePassword(userId, oldPassword, newPassword) {
    const [user] = await sql`
      SELECT password_hash FROM users WHERE user_id = ${userId}
    `;
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }
    
    const newHash = await bcrypt.hash(newPassword, 10);
    
    await sql`
      UPDATE users
      SET password_hash = ${newHash}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `;
    
    return true;
  }
  
  // Delete user (soft delete by setting inactive)
  static async delete(userId) {
    const [user] = await sql`
      UPDATE users
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
      RETURNING user_id
    `;
    
    return user;
  }
}

export default UserModel;
