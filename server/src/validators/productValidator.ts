import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().optional(),
  description: z.string().default(''),
  price: z.number().min(0, 'Price must be positive'),
  images: z.array(z.string()).default([]),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default(['A4', 'A3', 'A2']),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
