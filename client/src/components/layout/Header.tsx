import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useBagStore } from '../../store/bagStore';

export const Header: React.FC = () => {
  const { toggleBag, getItemCount } = useBagStore();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAFA] border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Bold script vibe matching reference */}
        <Link to="/" className="flex items-center gap-1 group">
          <span className="font-logo text-2xl sm:text-3xl tracking-tight text-black group-hover:text-neutral-700 transition-colors">
            Slap it.
          </span>
        </Link>

        {/* Center / Right Links */}
        <nav className="flex items-center gap-8">
          <div className="hidden sm:flex items-center gap-6 text-sm font-semibold tracking-wide">
            <Link
              to="/posters"
              className="text-neutral-700 hover:text-black transition-colors"
            >
              posters
            </Link>
            <Link
              to="/posters?category=cards"
              className="text-neutral-700 hover:text-black transition-colors"
            >
              cards
            </Link>
          </div>

          {/* Bag Button matching reference pill layout */}
          <button
            onClick={toggleBag}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5CE1E6] text-black border-2 border-black font-bold text-xs sm:text-sm shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono text-xs">{itemCount}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
