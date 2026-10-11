import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.post('/', authenticate, requireAdmin, categoryController.createCategory);
router.put('/:id', authenticate, requireAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, requireAdmin, categoryController.deleteCategory);

export default router;
