import { z } from 'zod';

const MAX_PRODUCT_IMAGE_DATA_SIZE = 14 * 1024 * 1024;

const productFieldsSchema = z.object({
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

const validateImageDataSize = (images: string[], ctx: z.RefinementCtx) => {
  const imageDataSize = images.reduce(
    (total, image) => total + (image.startsWith('data:') ? image.length : 0),
    0
  );

  if (imageDataSize > MAX_PRODUCT_IMAGE_DATA_SIZE) {
    ctx.addIssue({
      code: 'custom',
      message: 'Combined image data must be no larger than 14 MiB per product',
      path: ['images'],
    });
  }
};

export const createProductSchema = productFieldsSchema.superRefine((product, ctx) => {
  validateImageDataSize(product.images, ctx);
});

export const updateProductSchema = productFieldsSchema.partial().superRefine((product, ctx) => {
  if (product.images) validateImageDataSize(product.images, ctx);
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
