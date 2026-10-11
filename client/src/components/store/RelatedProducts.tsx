import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="pt-16 pb-8 border-t-2 border-black mt-16">
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-black text-black">
          You might also slap these
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
};
