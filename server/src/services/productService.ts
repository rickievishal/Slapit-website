import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { CreateProductInput, UpdateProductInput } from '../validators/productValidator';

interface ProductFilters {
  category?: string;
  search?: string;
  sort?: string;
  status?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export const productService = {
  async getAll(filters: ProductFilters) {
    const { category, search, sort, status, featured, page = 1, limit = 20 } = filters;

    const query: any = {};

    if (status) query.status = status;
    else query.status = 'published'; // default to published for public

    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'featured':
        sortOption = { featured: -1, createdAt: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Product.find(query).populate('category').sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  },

  async getBySlug(slug: string) {
    const product = await Product.findOne({ slug }).populate('category');
    if (!product) throw new AppError('Product not found', 404);
    return product;
  },

  async getById(id: string) {
    const product = await Product.findById(id).populate('category');
    if (!product) throw new AppError('Product not found', 404);
    return product;
  },

  async create(data: CreateProductInput) {
    const product = new Product(data);
    await product.save();
    return product.populate('category');
  },

  async update(id: string, data: UpdateProductInput) {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('category');
    if (!product) throw new AppError('Product not found', 404);
    return product;
  },

  async delete(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new AppError('Product not found', 404);
    return product;
  },

  async updateStatus(id: string, status: 'draft' | 'published') {
    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('category');
    if (!product) throw new AppError('Product not found', 404);
    return product;
  },

  async getFeatured(limit: number = 3) {
    return Product.find({ featured: true, status: 'published' })
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  async getRelated(productId: string, limit: number = 4) {
    const product = await Product.findById(productId);
    if (!product) return [];

    return Product.find({
      _id: { $ne: productId },
      category: product.category,
      status: 'published',
    })
      .populate('category')
      .limit(limit);
  },
};
