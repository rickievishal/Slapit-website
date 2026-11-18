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
  async getInventory() {
    const products = await Product.find()
      .select('+inventory')
      .populate('category')
      .sort({ name: 1 });
    return products.flatMap((product) =>
      product.sizes.map((size) => ({
        productId: product._id,
        productName: product.name,
        image: product.images[0]?.startsWith('data:') ? '' : product.images[0] || '',
        category: product.category,
        productStatus: product.status,
        size,
        quantity: product.inventory.find((item) => item.size === size)?.quantity ?? 0,
      }))
    );
  },

  async updateInventory(productId: string, size: string, quantity: number) {
    if (!/^[a-f\d]{24}$/i.test(productId)) {
      throw new AppError('Product not found', 404);
    }

    const product = await Product.findById(productId).select('+inventory');
    if (!product) throw new AppError('Product not found', 404);
    if (!product.sizes.includes(size)) {
      throw new AppError('This size is not available for the product', 400);
    }

    const inventoryItem = product.inventory.find((item) => item.size === size);
    if (inventoryItem) inventoryItem.quantity = quantity;
    else product.inventory.push({ size, quantity });

    await product.save();
    return {
      productId: product._id,
      productName: product.name,
      size,
      quantity: product.inventory.find((item) => item.size === size)?.quantity ?? quantity,
    };
  },

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
    const product = await Product.findById(id).select('+inventory');
    if (!product) throw new AppError('Product not found', 404);
    Object.assign(product, data);
    await product.save();
    return product.populate('category');
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
