import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FAFAFA] border-t-2 border-black pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Shop */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-neutral-400 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link to="/posters" className="hover:underline">All Posters</Link>
              </li>
              <li>
                <Link to="/posters?sort=latest" className="hover:underline">New Drops</Link>
              </li>
              <li>
                <Link to="/posters?sort=featured" className="hover:underline">Bestsellers</Link>
              </li>
              <li>
                <Link to="/posters?category=limited" className="hover:underline">Limited</Link>
              </li>
            </ul>
          </div>

          {/* Posters */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-neutral-400 mb-4">Posters</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link to="/posters?category=art" className="hover:underline">Art</Link>
              </li>
              <li>
                <Link to="/posters?category=movies" className="hover:underline">Movies</Link>
              </li>
              <li>
                <Link to="/posters?category=music" className="hover:underline">Music</Link>
              </li>
              <li>
                <Link to="/posters?category=sports" className="hover:underline">Sports</Link>
              </li>
              <li>
                <Link to="/posters?category=typography" className="hover:underline">Typography</Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-neutral-400 mb-4">About</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <span className="cursor-pointer hover:underline">Our Story</span>
              </li>
              <li>
                <span className="cursor-pointer hover:underline">Shipping</span>
              </li>
              <li>
                <span className="cursor-pointer hover:underline">Contact</span>
              </li>
              <li>
                <span className="cursor-pointer hover:underline">FAQs</span>
              </li>
            </ul>
          </div>

          {/* Mini Collage Preview */}
          <div className="hidden md:block">
            <div className="p-3 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000]">
              <div className="grid grid-cols-2 gap-1.5 aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=400&auto=format&fit=crop"
                  alt="Poster sample 1"
                  className="w-full h-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop"
                  alt="Poster sample 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-[11px] font-bold tracking-tight text-neutral-600 uppercase">
                India's Dopest Print Label
              </p>
            </div>
          </div>
        </div>

        {/* Huge bottom branding - "Slapit India" matching reference */}
        <div className="relative pt-8 flex flex-col md:flex-row items-baseline justify-end gap-4">
          <h1 className="absolute left-0 bottom-0 hidden lg:block md:-bottom-[80px] md:text-[150px] font-black tracking-tighter text-black uppercase select-none leading-none">
            Slapit India
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            © {new Date().getFullYear()} SLAP IT Inc. Printed on demand.
          </p>
        </div>
      </div>
    </footer>
  );
};
