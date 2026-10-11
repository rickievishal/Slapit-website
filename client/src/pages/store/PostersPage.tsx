import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../../components/store/ProductGrid';
import { CategoryFilter } from '../../components/store/CategoryFilter';
import { SearchBar } from '../../components/common/SearchBar';
import { SortDropdown } from '../../components/store/SortDropdown';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, Category } from '../../types';

export const PostersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'latest';

  // Load categories once
  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Load products whenever query params change
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const categoryObj = categories.find((c) => c.slug === currentCategory);
        const res = await productService.getProducts({
          category: categoryObj?._id,
          search: currentSearch || undefined,
          sort: currentSort,
          limit: 40,
        });
        setProducts(res.items);
        setTotalCount(res.total);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentCategory, currentSearch, currentSort, categories]);

  const updateParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  return (
    <div className="py-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Intro matching Panel 02 */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight uppercase leading-none">
            POSTERS
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 font-medium">
            Find something worth putting on your wall.
          </p>
        </div>

        {/* Filter and Search Bar Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-300">
          <CategoryFilter
            categories={categories}
            selectedCategory={currentCategory}
            onSelectCategory={(slug) => updateParam('category', slug)}
          />

          <div className="w-full md:w-72 shrink-0">
            <SearchBar
              value={currentSearch}
              onChange={(val) => updateParam('search', val)}
            />
          </div>
        </div>

        {/* Counts & Sort Row */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs sm:text-sm font-bold text-neutral-600 font-mono">
            {totalCount} posters
          </span>
          <SortDropdown
            value={currentSort}
            onChange={(val) => updateParam('sort', val)}
          />
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
};
