import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types';

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    image: { type: String, default: '' },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'paid', 'printing', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('validate', async function () {
  if (!this.orderNumber) {
    const count = await mongoose.models.Order.countDocuments();
    this.orderNumber = `#SLP${(1001 + count).toString()}`;
  }
});

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
