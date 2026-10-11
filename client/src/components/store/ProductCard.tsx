import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useBagStore } from '../../store/bagStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useBagStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      productName: product.name,
      image: product.images[0] || '',
      size: product.sizes[0] || 'A4',
      quantity: 1,
      price: product.price,
      slug: product.slug,
    });
  };

  return (
    <div className="group flex flex-col bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] transition-all">
      {/* Poster Image Container */}
      <Link
        to={`/posters/${product.slug}`}
        className="relative block aspect-3/4 overflow-hidden bg-neutral-100 border-b-2 border-black"
      >
        <img
          src={product.images[0] || 'https://placehold.co/600x800/1a1a1a/5CE1E6?text=Poster'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Heart icon button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 backdrop-blur-xs border border-black rounded-none text-neutral-700 hover:text-red-500 hover:bg-white transition-colors cursor-pointer"
          aria-label="Save to wishlist"
        >
          <Heart className="w-3.5 h-3.5" />
        </button>
      </Link>

      {/* Info & Action Strip */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white space-y-3">
        <div className="flex items-start justify-between gap-1">
          <Link
            to={`/posters/${product.slug}`}
            className="font-bold text-sm sm:text-base text-black hover:underline line-clamp-1 leading-snug"
          >
            {product.name}
          </Link>
          <span className="font-black text-sm sm:text-base text-black whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Add to Bag Button */}
        <button
          onClick={handleQuickAdd}
          className="w-full py-2 px-3 bg-[#5CE1E6] text-black font-bold text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#3BBFC4] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
};
