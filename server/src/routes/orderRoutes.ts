import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import {
  authenticate,
  optionalAuthenticate,
  requireAdmin,
  requireCustomer,
} from '../middleware/auth';

const router = Router();

// Public
router.post('/', optionalAuthenticate, orderController.createOrder);
router.get('/track/:orderNumber', orderController.getOrderByNumber);
router.get('/mine', authenticate, requireCustomer, orderController.getMyOrders);
router.get('/mine/:id', authenticate, requireCustomer, orderController.getMyOrderById);

// Admin
router.get('/admin', authenticate, requireAdmin, orderController.getAllOrders);
router.get('/admin/stats', authenticate, requireAdmin, orderController.getDashboardStats);
router.get('/admin/:id', authenticate, requireAdmin, orderController.getOrderById);
router.patch('/admin/:id/status', authenticate, requireAdmin, orderController.updateOrderStatus);

export default router;
