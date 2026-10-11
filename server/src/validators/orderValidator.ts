import { z } from 'zod';

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        size: z.string().min(1, 'Size is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10),
      })
    )
    .min(1, 'At least one item is required'),
  shippingAddress: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(6, 'Pincode must be 6 digits').max(6),
  }),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['placed', 'paid', 'printing', 'packed', 'shipped', 'delivered', 'cancelled']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
