import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border-2 border-neutral-300 bg-white p-3 space-y-3 animate-pulse"
          >
            <div className="aspect-3/4 bg-neutral-200" />
            <div className="h-4 bg-neutral-200 w-3/4" />
            <div className="h-8 bg-neutral-200 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-neutral-300 bg-white p-8">
        <p className="text-xl font-black text-black">No posters found</p>
        <p className="text-sm text-neutral-500 mt-1">
          Try clearing search keywords or switching filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
