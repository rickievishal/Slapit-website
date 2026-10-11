import { Category } from '../models/Category';
import { AppError } from '../middleware/errorHandler';

export const categoryService = {
  async getAll() {
    return Category.find().sort({ name: 1 });
  },

  async getBySlug(slug: string) {
    const category = await Category.findOne({ slug });
    if (!category) throw new AppError('Category not found', 404);
    return category;
  },

  async create(data: { name: string; slug?: string; description?: string; image?: string }) {
    const category = new Category(data);
    await category.save();
    return category;
  },

  async update(id: string, data: Partial<{ name: string; description: string; image: string }>) {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) throw new AppError('Category not found', 404);
    return category;
  },

  async delete(id: string) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new AppError('Category not found', 404);
    return category;
  },
};
