import { Router, Request, Response, NextFunction } from 'express';
import { upload } from '../middleware/upload';
import { authenticate, requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new AppError('No image file provided', 400);
      }
      const url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      res.status(201).json({
        success: true,
        data: { url },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
