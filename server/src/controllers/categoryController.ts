import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';

export const categoryController = {
  async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAll();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.getBySlug(req.params.slug as string);
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.update(req.params.id as string, req.body);
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoryService.delete(req.params.id as string);
      res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  },
};
