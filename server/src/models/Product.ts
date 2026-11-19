import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    thumbnail: { type: String, default: '', select: false },
    thumbnailVersion: { type: Number, default: 0, select: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String, trim: true }],
    sizes: { type: [String], default: ['A4', 'A3', 'A2'] },
    inventory: {
      type: [
        new Schema(
          {
            size: { type: String, required: true },
            quantity: { type: Number, required: true, min: 0, default: 0 },
          },
          { _id: false }
        ),
      ],
      default: [],
      select: false,
    },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
);

productSchema.pre('validate', function () {
  const quantitiesBySize = new Map(
    (this.inventory || []).map((item) => [item.size, item.quantity])
  );
  this.inventory = [...new Set(this.sizes)].map((size) => ({
    size,
    quantity: quantitiesBySize.get(size) ?? 0,
  }));
});

// Auto-generate slug from name
productSchema.pre('validate', async function () {
  if (this.isModified('name') && !this.isModified('slug')) {
    let slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const existing = await mongoose.models.Product.findOne({ slug, _id: { $ne: this._id } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    this.slug = slug;
  }
});

productSchema.index({ name: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ status: 1, price: 1 });
productSchema.index({ status: 1, featured: -1, createdAt: -1 });
productSchema.index({ status: 1, name: 1 });
productSchema.index({ name: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
