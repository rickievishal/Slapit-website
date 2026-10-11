import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { CreateOrderInput } from '../validators/orderValidator';
import { OrderStatus } from '../types';

const SHIPPING_COST = 99; // flat shipping rate

export const orderService = {
  async create(data: CreateOrderInput) {
    // Fetch all products from DB - NEVER trust client prices
    const productIds = data.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      throw new AppError('One or more products not found', 400);
    }

    // Build order items with server-side prices
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) throw new AppError(`Product ${item.productId} not found`, 400);

      if (product.status !== 'published') {
        throw new AppError(`Product "${product.name}" is not available`, 400);
      }

      if (!product.sizes.includes(item.size)) {
        throw new AppError(`Size "${item.size}" is not available for "${product.name}"`, 400);
      }

      return {
        productId: product._id,
        productName: product.name,
        image: product.images[0] || '',
        size: item.size,
        quantity: item.quantity,
        price: product.price, // SERVER-SIDE price
      };
    });

    // Calculate totals server-side
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? SHIPPING_COST : 0;
    const total = subtotal + shipping;

    const order = new Order({
      customer: data.customer,
      items: orderItems,
      subtotal,
      shipping,
      total,
      shippingAddress: data.shippingAddress,
    });

    await order.save();
    return order;
  },

  async getById(id: string) {
    const order = await Order.findById(id);
    if (!order) throw new AppError('Order not found', 404);
    return order;
  },

  async getByNumber(orderNumber: string) {
    const order = await Order.findOne({ orderNumber });
    if (!order) throw new AppError('Order not found', 404);
    return order;
  },

  async getAll(filters: { status?: string; page?: number; limit?: number; sort?: string }) {
    const { status, page = 1, limit = 20, sort } = filters;
    const query: any = {};

    if (status) query.orderStatus = status;

    let sortOption: any = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'total_desc') sortOption = { total: -1 };

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Order.find(query).sort(sortOption).skip(skip).limit(limit),
      Order.countDocuments(query),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
  },

  async updateStatus(id: string, status: OrderStatus) {
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true, runValidators: true }
    );
    if (!order) throw new AppError('Order not found', 404);
    return order;
  },

  async getDashboardStats() {
    const [revenue, orders, products, customers] = await Promise.all([
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.distinct('customer.email').then((emails) => emails.length),
    ]);

    return {
      revenue: revenue[0]?.total || 0,
      orders,
      products,
      customers,
    };
  },
};
