import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/orderValidator';
import { AuthRequest } from '../middleware/auth';

export const orderController = {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createOrderSchema.parse(req.body);
      const order = await orderService.create(validated, req.user?._id.toString());
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  async getMyOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const requestedPage = Number(req.query.page);
      const requestedLimit = Number(req.query.limit);
      const page =
        Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
      const limit =
        Number.isSafeInteger(requestedLimit) && requestedLimit > 0
          ? Math.min(50, requestedLimit)
          : 20;
      const result = await orderService.getCustomerOrders(
        req.user._id.toString(),
        page,
        limit
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getMyOrderById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const order = await orderService.getCustomerOrderById(
        req.user._id.toString(),
        req.params.id as string
      );
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  async getOrderByNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.getByNumber(req.params.orderNumber as string);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.getById(req.params.id as string);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, page, limit, sort } = req.query;
      const result = await orderService.getAll({
        status: status as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        sort: sort as string,
      });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = updateOrderStatusSchema.parse(req.body);
      const order = await orderService.updateStatus(req.params.id as string, validated.status);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  async getDashboardStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await orderService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },
};
