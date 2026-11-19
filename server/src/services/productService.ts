import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { CreateProductInput, UpdateProductInput } from '../validators/productValidator';
import sharp from 'sharp';

const PRODUCT_THUMBNAIL_SIZE = 320;

const createThumbnail = async (image: string): Promise<string> => {
  const separatorIndex = image.indexOf(',');
  if (!image.startsWith('data:') || separatorIndex === -1) return image;

  const original = Buffer.from(image.slice(separatorIndex + 1), 'base64');
  const thumbnail = await sharp(original)
    .rotate()
    .resize(PRODUCT_THUMBNAIL_SIZE, PRODUCT_THUMBNAIL_SIZE, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 72 })
    .toBuffer();

  return `data:image/jpeg;base64,${thumbnail.toString('base64')}`;
};

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
      .sort({ name: 1 })
      .allowDiskUse(true);
    return products.flatMap((product) =>
      product.sizes.map((size, index) => ({
        productId: product._id,
        productName: product.name,
        image: index === 0 ? product.images[0] || '' : '',
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
      Product.find(query)
        .select('+thumbnail')
        .populate('category')
        .sort(sortOption)
        .allowDiskUse(true)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    const listingItems = [];
    for (let index = 0; index < items.length; index += 4) {
      const batch = await Promise.all(
        items.slice(index, index + 4).map(async (product) => {
          const originalImage = product.images[0] || '';
          let thumbnail = product.thumbnail || '';

          if (!thumbnail && originalImage) {
            thumbnail = await createThumbnail(originalImage);
            await Product.updateOne({ _id: product._id }, { $set: { thumbnail } });
          }

          return {
            ...product.toObject(),
            images: thumbnail ? [thumbnail] : [],
          };
        })
      );
      listingItems.push(...batch);
    }

    return {
      items: listingItems,
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
    const product = await Product.findById(id).select('+inventory +thumbnail');
    if (!product) throw new AppError('Product not found', 404);
    if (data.images) product.thumbnail = '';
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
