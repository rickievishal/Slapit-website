import { Router, Request, Response, NextFunction } from 'express';
import { upload } from '../middleware/upload';
import { authenticate, requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { imageStorageService } from '../services/imageStorageService';

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
      const url = await imageStorageService.store(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );
      res.status(201).json({
        success: true,
        data: { url },
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/files/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = await imageStorageService.getFile(req.params.id as string);
      if (!file) throw new AppError('Image not found', 404);

      res.setHeader('Content-Type', file.contentType);
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      file.stream.on('error', next);
      file.stream.pipe(res);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
