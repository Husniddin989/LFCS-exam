import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '../config/database.js';
import { redis } from '../config/redis.js';
import { generateTokens, verifyRefreshToken, blacklistToken } from '../middleware/auth.middleware.js';
import { success, created, error, unauthorized } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Register new user
export const register = async (req, res) => {
  const { email, password, username, displayName } = req.body;

  // Check if email already exists
  const existingEmail = await db('users').where({ email }).first();
  if (existingEmail) {
    return error(res, 'Email already registered', 409);
  }

  // Check if username already exists
  const existingUsername = await db('users').where({ username }).first();
  if (existingUsername) {
    return error(res, 'Username already taken', 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const [user] = await db('users')
    .insert({
      email,
      username,
      password_hash: passwordHash,
      display_name: displayName || username,
      verification_token: verificationToken
    })
    .returning(['id', 'email', 'username', 'display_name', 'role', 'email_verified', 'created_at']);

  // Create initial stats
  await db('user_stats').insert({
    user_id: user.id,
    total_xp: 0,
    current_streak: 0,
    longest_streak: 0
  });

  // TODO: Send verification email
  logger.info(`New user registered: ${email}, verification token: ${verificationToken}`);

  // Generate tokens
  const tokens = generateTokens(user.id);

  // Store refresh token
  await redis.setex(`refresh:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

  return created(res, {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name,
      role: user.role,
      emailVerified: user.email_verified
    },
    tokens
  });
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await db('users')
    .where({ email, is_active: true })
    .first();

  if (!user) {
    return unauthorized(res, 'Invalid email or password');
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return unauthorized(res, 'Invalid email or password');
  }

  // Update last login
  await db('users')
    .where({ id: user.id })
    .update({ last_login_at: new Date() });

  // Generate tokens
  const tokens = generateTokens(user.id);

  // Store refresh token
  await redis.setex(`refresh:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

  return success(res, {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name,
      role: user.role,
      emailVerified: user.email_verified
    },
    tokens
  });
};

// Logout user
export const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token) {
    // Blacklist the access token
    await blacklistToken(token, 15 * 60); // 15 minutes
  }

  // Remove refresh token
  await redis.del(`refresh:${req.user.id}`);

  return success(res, { message: 'Logged out successfully' });
};

// Refresh access token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return unauthorized(res, 'Refresh token required');
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token is valid in Redis
    const storedToken = await redis.get(`refresh:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return unauthorized(res, 'Invalid refresh token');
    }

    // Generate new tokens
    const tokens = generateTokens(decoded.userId);

    // Update refresh token in Redis
    await redis.setex(`refresh:${decoded.userId}`, 7 * 24 * 60 * 60, tokens.refreshToken);

    return success(res, { tokens });
  } catch (err) {
    return unauthorized(res, 'Invalid or expired refresh token');
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return error(res, 'Verification token required');
  }

  const user = await db('users')
    .where({ verification_token: token, email_verified: false })
    .first();

  if (!user) {
    return error(res, 'Invalid or expired verification token', 400);
  }

  await db('users')
    .where({ id: user.id })
    .update({
      email_verified: true,
      verification_token: null
    });

  return success(res, { message: 'Email verified successfully' });
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await db('users').where({ email, is_active: true }).first();

  if (!user) {
    // Don't reveal if user exists
    return success(res, { message: 'If your email is registered, you will receive a password reset link' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Store in database
  await db('password_resets').insert({
    user_id: user.id,
    token: resetToken,
    expires_at: resetExpiry
  });

  // TODO: Send password reset email
  logger.info(`Password reset requested for: ${email}, token: ${resetToken}`);

  return success(res, { message: 'If your email is registered, you will receive a password reset link' });
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const resetRecord = await db('password_resets')
    .where('token', token)
    .where('expires_at', '>', new Date())
    .where('used', false)
    .first();

  if (!resetRecord) {
    return error(res, 'Invalid or expired reset token', 400);
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(password, 12);

  // Update user password
  await db('users')
    .where({ id: resetRecord.user_id })
    .update({ password_hash: passwordHash });

  // Mark token as used
  await db('password_resets')
    .where({ id: resetRecord.id })
    .update({ used: true });

  // Invalidate all user sessions
  await redis.del(`refresh:${resetRecord.user_id}`);

  return success(res, { message: 'Password reset successfully' });
};

// Get current user profile
export const getProfile = async (req, res) => {
  const user = await db('users')
    .where({ id: req.user.id })
    .select('id', 'email', 'username', 'display_name', 'role', 'email_verified', 'created_at')
    .first();

  const stats = await db('user_stats')
    .where({ user_id: req.user.id })
    .first();

  return success(res, {
    ...user,
    displayName: user.display_name,
    emailVerified: user.email_verified,
    createdAt: user.created_at,
    stats: stats ? {
      totalXP: stats.total_xp,
      currentStreak: stats.current_streak,
      longestStreak: stats.longest_streak,
      totalLessonsCompleted: stats.total_lessons_completed,
      totalQuizzesCompleted: stats.total_quizzes_completed,
      totalLabsCompleted: stats.total_labs_completed
    } : null
  });
};

// Update profile
export const updateProfile = async (req, res) => {
  const { displayName, username } = req.body;

  // Check username uniqueness if changing
  if (username && username !== req.user.username) {
    const existing = await db('users')
      .where({ username })
      .whereNot({ id: req.user.id })
      .first();
    if (existing) {
      return error(res, 'Username already taken', 409);
    }
  }

  const updates = {};
  if (displayName !== undefined) updates.display_name = displayName;
  if (username !== undefined) updates.username = username;

  if (Object.keys(updates).length > 0) {
    await db('users')
      .where({ id: req.user.id })
      .update(updates);
  }

  return success(res, { message: 'Profile updated successfully' });
};
