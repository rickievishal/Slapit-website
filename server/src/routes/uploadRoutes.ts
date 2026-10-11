import { Router, Request, Response, NextFunction } from 'express';
import { upload, storageProvider } from '../middleware/upload';
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
      const url = await storageProvider.upload(req.file);
      res.status(201).json({
        success: true,
        data: { url, filename: req.file.filename },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
