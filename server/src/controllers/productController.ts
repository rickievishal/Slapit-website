import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService';
import { createProductSchema, updateProductSchema } from '../validators/productValidator';

export const productController = {
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, search, sort, status, featured, page, limit } = req.query;
      const result = await productService.getAll({
        category: category as string,
        search: search as string,
        sort: sort as string,
        status: status as string,
        featured: featured === undefined ? undefined : featured === 'true',
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getFeaturedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3;
      const products = await productService.getFeatured(limit);
      res.json({ success: true, data: products });
    } catch (err) {
      next(err);
    }
  },

  async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getBySlug(req.params.slug as string);
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getById(req.params.id as string);
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async getRelatedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 4;
      const products = await productService.getRelated(req.params.id as string, limit);
      res.json({ success: true, data: products });
    } catch (err) {
      next(err);
    }
  },

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createProductSchema.parse(req.body);
      const product = await productService.create(validated);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = updateProductSchema.parse(req.body);
      const product = await productService.update(req.params.id as string, validated);
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.delete(req.params.id as string);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const product = await productService.updateStatus(req.params.id as string, status);
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },
};
