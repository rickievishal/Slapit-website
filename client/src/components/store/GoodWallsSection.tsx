import React from 'react';

export const GoodWallsSection: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#FAFAFA] grid-paper border-b-2 border-black overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        {/* Playful green doodle element on left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block">
          <svg className="w-16 h-16 text-emerald-500 animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
            <path d="M20 50 Q 50 10 80 50 Q 50 90 20 50 Z" />
          </svg>
        </div>

        {/* Playful yellow coil doodle on right */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
          <svg className="w-16 h-16 text-amber-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
            <circle cx="50" cy="50" r="30" strokeDasharray="15 10" />
          </svg>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-black tracking-tight leading-tight">
          Good walls deserve
          <br />
          good prints.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto font-medium">
          Premium posters, printed on demand and shipped across India.
        </p>
      </div>
    </section>
  );
};
