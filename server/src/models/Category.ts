import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../types';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function () {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);
