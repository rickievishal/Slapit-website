import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { loginSchema, registerSchema } from '../validators/authValidator';
import { AuthRequest } from '../middleware/auth';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await authService.login(validated.email, validated.password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);
      const role = req.body.role === 'admin' ? 'admin' : 'customer';
      const result = await authService.register(validated.name, validated.email, validated.password, role);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      res.json({
        success: true,
        data: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
