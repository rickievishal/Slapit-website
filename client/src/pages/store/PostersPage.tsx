import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../../components/store/ProductGrid';
import { CategoryFilter } from '../../components/store/CategoryFilter';
import { SearchBar } from '../../components/common/SearchBar';
import { SortDropdown } from '../../components/store/SortDropdown';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, Category } from '../../types';
import { usePageSeo } from '../../utils/seo';

export const PostersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'latest';
  const requestedPage = Number(searchParams.get('page'));
  const currentPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const [totalPages, setTotalPages] = useState(1);
  const selectedCategory = categories.find((category) => category.slug === currentCategory);
  const title = selectedCategory
    ? `${selectedCategory.name} Posters | Slap It Posters`
    : 'Shop Posters & Wall Art Online | Slap It Posters';
  const description = selectedCategory
    ? `Shop ${selectedCategory.name.toLowerCase()} posters and wall art at Slap It Posters. Explore bold designs printed on premium matte paper and delivered across India.`
    : 'Browse art, movie, music, sports and typography posters at Slap It Posters. Find bold wall art printed on premium matte paper and delivered across India.';
  const canonicalPath = currentCategory
    ? `/posters?category=${encodeURIComponent(currentCategory)}${currentPage > 1 ? `&page=${currentPage}` : ''}`
    : currentSearch || currentSort !== 'latest'
      ? '/posters'
      : currentPage > 1
        ? `/posters?page=${currentPage}`
        : '/posters';

  usePageSeo({
    title,
    description,
    path: canonicalPath,
  });

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
          page: currentPage,
          limit: 12,
        });
        setProducts(res.items);
        setTotalCount(res.total);
        setTotalPages(res.pages);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentCategory, currentSearch, currentSort, currentPage, categories]);

  const updateParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== 'page') next.delete('page');
      return next;
    });
  };

  const goToPage = (page: number) => {
    updateParam('page', page > 1 ? String(page) : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {!isLoading && totalPages > 1 && (
          <nav
            aria-label="Poster pages"
            className="mt-10 flex items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-mono text-xs font-bold text-neutral-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="border-2 border-black bg-[#5CE1E6] px-4 py-2 text-xs font-black uppercase disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};
