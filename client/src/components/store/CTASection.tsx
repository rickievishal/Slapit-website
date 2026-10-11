import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 md:p-16 border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-block text-[11px] font-black tracking-widest uppercase bg-[#5CE1E6] text-black px-2 py-0.5 border border-black mb-3">
              READY TO SHOP?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
              Find your next wall hero
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              Browse posters, cards, and fresh drops in one place. New designs are added regularly, so you can keep your space feeling fresh.
            </p>
            <p className="mt-2 text-xs font-mono font-bold text-neutral-400 uppercase">
              NEW DROPS EVERY WEEK
            </p>
          </div>

          <div className="shrink-0">
            <Link to="/posters">
              <Button size="lg" variant="primary" className="flex items-center gap-2">
                <span>Explore Posters</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
