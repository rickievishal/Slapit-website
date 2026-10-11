import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Button } from '../../components/common/Button';

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 499,
    category: '',
    images: [] as string[],
    sizes: ['A4', 'A3', 'A2'],
    tags: '',
    featured: false,
    status: 'published' as 'draft' | 'published',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditing);

  useEffect(() => {
    categoryService.getCategories().then((cats) => {
      setCategories(cats);
      if (!isEditing && cats.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: cats[0]._id }));
      }
    });

    if (isEditing && id) {
      productService.getProductBySlug(id).catch(async () => {
        // or by id if slug query fails
        const all = await productService.getProducts({ limit: 100 });
        return all.items.find((p) => p._id === id);
      }).then((prod: any) => {
        if (prod) {
          setFormData({
            name: prod.name,
            description: prod.description || '',
            price: prod.price,
            category: prod.category?._id || prod.category,
            images: prod.images || [],
            sizes: prod.sizes || ['A4', 'A3', 'A2'],
            tags: prod.tags?.join(', ') || '',
            featured: Boolean(prod.featured),
            status: prod.status || 'published',
          });
        }
      }).finally(() => {
        setIsLoadingProduct(false);
      });
    }
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const nextSizes = exists
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: nextSizes.length ? nextSizes : [size] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        name: formData.name.trim(),
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        images: formData.images,
        sizes: formData.sizes,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        featured: formData.featured,
        status: formData.status,
      };

      if (isEditing && id) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }

      navigate('/admin/products');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return <div className="py-12 text-center text-sm font-bold">Loading product details...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Products</span>
      </Link>

      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          {isEditing ? 'Edit Poster' : 'Create New Poster'}
        </h1>
        <p className="text-xs text-neutral-500 font-medium">
          Fill in artwork specifications, imagery, pricing, and availability
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 sm:p-8 space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1">
            Poster Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Neon City"
            className="w-full p-2.5 text-sm border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Print description, paper quality, aesthetic notes..."
            className="w-full p-2.5 text-sm border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
          />
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">
              Price (₹ INR)
            </label>
            <input
              type="number"
              name="price"
              min={0}
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-2.5 text-sm border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-2.5 text-sm border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#5CE1E6] bg-white"
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Images with Uploader */}
        <ImageUploader
          images={formData.images}
          onChange={(imgs) => setFormData((prev) => ({ ...prev, images: imgs }))}
        />

        {/* Sizes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">
            Available Sizes
          </label>
          <div className="flex gap-4">
            {['A4', 'A3', 'A2'].map((size) => {
              const active = formData.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 text-xs font-bold border-2 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#5CE1E6] border-black shadow-[2px_2px_0px_0px_#000000]'
                      : 'bg-white border-neutral-300 text-neutral-600'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="neon, retro, cyberpunk, vintage"
            className="w-full p-2.5 text-sm border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
          />
        </div>

        {/* Status & Featured */}
        <div className="pt-2 border-t border-neutral-200 flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 accent-[#5CE1E6]"
            />
            <span className="text-xs font-bold uppercase tracking-wider">
              Mark as Featured
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-bold uppercase tracking-wider">Status:</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-1.5 text-xs font-bold border border-black bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          className="py-3 shadow-[4px_4px_0px_0px_#000000]"
        >
          {isEditing ? 'Save Changes' : 'Publish Poster'}
        </Button>
      </form>
    </div>
  );
};
