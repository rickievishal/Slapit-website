import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

export const authService = {
  async login(email: string, password: string) {
  console.log('[AUTH] Login attempt received');

  const normalizedEmail = email.trim().toLowerCase();

  console.log('[AUTH] Database:', User.db.name);
  console.log('[AUTH] Collection:', User.collection.name);
  console.log('[AUTH] Email received:', JSON.stringify(normalizedEmail));

  const userCount = await User.countDocuments({
    email: normalizedEmail,
  });

  console.log('[AUTH] Matching user count:', userCount);

  const user = await User.findOne({
    email: normalizedEmail,
  }).select('+passwordHash');

  console.log('[AUTH] User found:', !!user);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  console.log('[AUTH] Hash exists:', !!user.passwordHash);

  const isMatch = await user.comparePassword(password);
  console.log('[AUTH] Password matched:', isMatch);

  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = this.generateToken(
    (user._id as any).toString(),
    user.role
  );

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
},

  async register(name: string, email: string, password: string, role: 'admin' | 'customer' = 'customer') {
    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email already registered', 409);

    const user = new User({ name, email, passwordHash: password, role });
    await user.save();

    const token = this.generateToken((user._id as any).toString(), user.role);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '7d' });
  },
};
