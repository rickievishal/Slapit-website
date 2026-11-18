import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { CreateOrderInput } from '../validators/orderValidator';
import { OrderStatus } from '../types';
import mongoose from 'mongoose';

const SHIPPING_COST = 99; // flat shipping rate

export const orderService = {
  async getInventoryDemand() {
    return Order.aggregate([
      { $match: { orderStatus: { $in: ['placed', 'paid', 'printing'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: { productId: '$items.productId', size: '$items.size' },
          orderedCopies: { $sum: '$items.quantity' },
          completedCopies: {
            $sum: {
              $cond: [
                { $eq: ['$items.printStatus', 'done'] },
                '$items.quantity',
                { $ifNull: ['$items.printedQuantity', 0] },
              ],
            },
          },
          orderNumbers: { $addToSet: '$orderNumber' },
        },
      },
      {
        $project: {
          _id: 0,
          productId: '$_id.productId',
          size: '$_id.size',
          orderedCopies: 1,
          completedCopies: 1,
          copiesToPrint: {
            $max: [{ $subtract: ['$orderedCopies', '$completedCopies'] }, 0],
          },
          orderCount: { $size: '$orderNumbers' },
        },
      },
    ]);
  },

  async getPrintJobs() {
    return Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: 'cancelled' },
          $or: [
            { orderStatus: { $in: ['placed', 'paid', 'printing'] } },
            { 'items.printTracked': true },
            { 'items.printedQuantity': { $gt: 0 } },
            { 'items.printStatus': 'done' },
          ],
        },
      },
      { $unwind: '$items' },
      {
        $match: {
          $or: [
            { orderStatus: { $in: ['placed', 'paid', 'printing'] } },
            { 'items.printTracked': true },
            { 'items.printedQuantity': { $gt: 0 } },
            { 'items.printStatus': 'done' },
          ],
        },
      },
      {
        $addFields: {
          'items.completedCopies': {
            $cond: [
              { $eq: ['$items.printStatus', 'done'] },
              '$items.quantity',
              { $ifNull: ['$items.printedQuantity', 0] },
            ],
          },
        },
      },
      {
        $group: {
          _id: { productId: '$items.productId', size: '$items.size' },
          productName: { $first: '$items.productName' },
          image: { $first: '$items.image' },
          quantity: { $sum: '$items.quantity' },
          completedCopies: { $sum: '$items.completedCopies' },
          orderNumbers: { $addToSet: '$orderNumber' },
        },
      },
      {
        $project: {
          _id: 0,
          productId: '$_id.productId',
          productName: 1,
          image: 1,
          size: '$_id.size',
          quantity: 1,
          completedCopies: 1,
          remainingCopies: { $subtract: ['$quantity', '$completedCopies'] },
          orderNumbers: 1,
          orderCount: { $size: '$orderNumbers' },
        },
      },
      { $sort: { productName: 1, size: 1 } },
    ]);
  },

  async updatePrintJob(productId: string, size: string, completedCopies: number) {
    if (!mongoose.isValidObjectId(productId)) {
      throw new AppError('Print job not found', 404);
    }

    const objectId = new mongoose.Types.ObjectId(productId);
    const orders = await Order.find({
      orderStatus: { $ne: 'cancelled' },
      items: { $elemMatch: { productId: objectId, size } },
    }).sort({ createdAt: 1 });

    if (orders.length === 0) {
      throw new AppError('Print job not found', 404);
    }

    const matchingItems = orders.flatMap((order) =>
      order.items
        .map((item, index) => ({ order, item, index }))
        .filter(
          ({ item }) =>
            item.productId.toString() === productId &&
            item.size === size &&
            (['placed', 'paid', 'printing'].includes(order.orderStatus) ||
              item.printTracked ||
              (item.printedQuantity || 0) > 0 ||
              item.printStatus === 'done')
        )
    );
    const totalCopies = matchingItems.reduce((sum, { item }) => sum + item.quantity, 0);

    if (completedCopies > totalCopies) {
      throw new AppError(`Completed copies cannot exceed ${totalCopies}`, 400);
    }

    let remainingCompletedCopies = completedCopies;
    const updates = new Map<string, Record<string, number | string | boolean>>();
    for (const { order, item, index } of matchingItems) {
      const printedQuantity = Math.min(item.quantity, remainingCompletedCopies);
      remainingCompletedCopies -= printedQuantity;
      const orderUpdates = updates.get(order._id.toString()) || {};
      orderUpdates[`items.${index}.printedQuantity`] = printedQuantity;
      orderUpdates[`items.${index}.printTracked`] = true;
      orderUpdates[`items.${index}.printStatus`] = 'pending';
      updates.set(order._id.toString(), orderUpdates);
    }

    const result = await Order.bulkWrite(
      Array.from(updates, ([id, fields]) => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(id) },
          update: { $set: fields },
        },
      }))
    );

    return { completedCopies, totalCopies, remainingCopies: totalCopies - completedCopies, modifiedOrders: result.modifiedCount };
  },

  async create(data: CreateOrderInput, userId?: string) {
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
        image: product.images[0]?.startsWith('data:') ? '' : product.images[0] || '',
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
      ...(userId ? { user: new mongoose.Types.ObjectId(userId) } : {}),
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

  async getCustomerOrders(userId: string, page = 1, limit = 20) {
    const query = { user: new mongoose.Types.ObjectId(userId) };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(query),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
  },

  async getCustomerOrderById(userId: string, orderId: string) {
    if (!mongoose.isValidObjectId(orderId)) {
      throw new AppError('Order not found', 404);
    }

    const order = await Order.findOne({
      _id: orderId,
      user: new mongoose.Types.ObjectId(userId),
    });
    if (!order) throw new AppError('Order not found', 404);
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
