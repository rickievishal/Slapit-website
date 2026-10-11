import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:slug', productController.getProductBySlug);
router.get('/:id/related', productController.getRelatedProducts);

// Admin routes
router.post('/', authenticate, requireAdmin, productController.createProduct);
router.put('/:id', authenticate, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, productController.deleteProduct);
router.patch('/:id/status', authenticate, requireAdmin, productController.updateStatus);

export default router;
