import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface FeaturedCollectionProps {
  products: Product[];
  isLoading?: boolean;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  products,
  isLoading = false,
}) => {
  const badges = ['BESTSELLER', 'NEW DROP', 'LIMITED'];

  return (
    <section className="py-16 bg-[#FAFAFA] border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching reference */}
        <div className="mb-10">
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-1">
            FEATURED COLLECTION
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black">
            Bold prints for every wall
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl">
            A quick edit of the posters that feel most Slapit: playful, graphic, and ready to ship.
          </p>
        </div>

        {/* 3 Featured Products in a row */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border-2 border-neutral-300 bg-white p-4 animate-pulse h-96" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {products.slice(0, 3).map((product, idx) => {
              const badge = badges[idx % badges.length];
              return (
                <div
                  key={product._id}
                  className="flex flex-col bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] transition-all"
                >
                  {/* Poster Image */}
                  <Link
                    to={`/posters/${product.slug}`}
                    className="relative block aspect-4/3 overflow-hidden bg-neutral-100 border-b-2 border-black"
                  >
                    <img
                      src={product.images[0] || 'https://placehold.co/600x800/1a1a1a/5CE1E6?text=Poster'}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                    />
                  </Link>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="inline-block text-[10px] font-black tracking-wider uppercase bg-amber-300 text-black px-2 py-0.5 border border-black mb-2">
                        {badge}
                      </span>
                      <h3 className="font-black text-xl text-black leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                        {product.description ||
                          'A bright, graphic poster that adds instant energy to any room.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                      <span className="font-black text-lg text-black">
                        {formatPrice(product.price)}
                      </span>
                      <Link
                        to={`/posters/${product.slug}`}
                        className="px-4 py-1.5 bg-[#5CE1E6] text-black font-bold text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#3BBFC4] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                      >
                        Shop
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
