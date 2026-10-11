import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPrice } from '../../utils/formatters';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // In admin we fetch all products including drafts
      const res = await productService.getProducts({ status: '', limit: 50 });
      setProducts(res.items);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      const updated = await productService.updateStatus(product._id, nextStatus);
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, status: updated.status } : p))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Manage, publish, and edit artwork listings
          </p>
        </div>

        <Link to="/admin/products/new">
          <Button variant="primary" size="md" className="flex items-center gap-1.5 shadow-[3px_3px_0px_0px_#000000]">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFA] border-b-2 border-black font-mono uppercase text-neutral-500">
              <tr>
                <th className="py-3 px-4">Poster</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Sizes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No products found. Add your first poster!
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-neutral-100 border border-black shrink-0 overflow-hidden">
                          <img
                            src={p.images[0] || 'https://placehold.co/600x800/1a1a1a/5CE1E6?text=Poster'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-black">{p.name}</p>
                          <p className="text-[11px] font-mono text-neutral-400">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-600">
                      {p.category?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 font-black text-sm text-black">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500">
                      {p.sizes?.join(', ') || 'A4, A3, A2'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <StatusBadge status={p.status} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${p._id}`}
                          className="p-1.5 border border-black hover:bg-[#5CE1E6] transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5 text-black" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 border border-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
