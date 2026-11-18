import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

const googleClient = new OAuth2Client();

const createSession = (user: InstanceType<typeof User>) => ({
  token: jwt.sign({ userId: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: '7d',
  }),
  user: {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  },
});

export const authService = {
  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    return createSession(user);
  },

  async register(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) throw new AppError('Email already registered', 409);

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password,
      role: 'customer',
    });
    await user.save();

    return createSession(user);
  },

  async loginWithGoogle(credential: string, audience: 'admin' | 'customer') {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new AppError('Google sign-in is not configured', 503);
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      throw new AppError('Invalid Google credential', 401);
    }

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new AppError('A verified Google email is required', 401);
    }

    let user = await User.findOne({ googleId: payload.sub });
    if (user) {
      if (user.role !== audience) {
        throw new AppError(
          audience === 'admin'
            ? 'This Google account is not linked to an admin account'
            : 'Use the admin sign-in page for this account',
          403
        );
      }
      return createSession(user);
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    user = await User.findOne({ email: normalizedEmail });
    if (user) {
      if (user.role !== audience) {
        throw new AppError(
          audience === 'admin'
            ? 'This Google account does not match an admin account'
            : 'Use the admin sign-in page for this account',
          403
        );
      }
      if (user.googleId && user.googleId !== payload.sub) {
        throw new AppError('This email is already linked to another Google account', 409);
      }
      user.googleId = payload.sub;
      user.name = user.name || payload.name || normalizedEmail;
      await user.save();
      return createSession(user);
    }

    if (audience === 'admin') {
      throw new AppError('No admin account matches this Google account', 403);
    }

    user = new User({
      name: payload.name || normalizedEmail,
      email: normalizedEmail,
      googleId: payload.sub,
      role: 'customer',
    });
    await user.save();
    return createSession(user);
  },
};
