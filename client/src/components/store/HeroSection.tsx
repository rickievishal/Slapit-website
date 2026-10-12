import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import image from '../../assets/hero-bg.png'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden pt-8  md:pt-14 grid-paper border-b-2 border-black">
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
        <div className="h-auto flex flex-col items-center text-center max-w-4xl mx-auto overflow-hidden">
          {/* Eyebrow & Shop Now Pill */}
          <div className="absolute md:top-30 inline-flex items-center gap-3 px-4 py-1.5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] mb-6 scale-75 lg:scale-100">
            <span className="text-xs sm:text-sm  font-black uppercase tracking-wider text-black">
              COOL POSTERS FOR COOL PEOPLE
            </span>
            <Link
              to="/posters"
              className="text-xs font-black bg-[#5CE1E6] px-2.5 py-0.5 border border-black uppercase hover:bg-[#3BBFC4] transition-colors"
            >
              shop now
            </Link>
          </div>
          <div className="relative h-[500px] w-full sm:max-w-[600px] sm:h-[500px] flex justify-end items-end">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={image}
              alt="Hero background"
            />
          </div>
          {/* Huge Slap it Typography Headline matching visual */}
          {/* <div className="relative my-2 select-none">
            
            <h1 className="text-7xl sm:text-9xl md:text-[11rem] font-black tracking-tighter text-black uppercase leading-none">
              Slap it.
            </h1>
            <span className="absolute -bottom-4 right-2 sm:right-10 text-2xl sm:text-4xl font-serif italic text-neutral-800 rotate-[-8deg] bg-[#FAFAFA]/80 px-2">
              cool posters
            </span>
          </div> */}
        </div>

        {/* Poster Collage matching visual reference */}
       
      </div>
    </section>
  );
};
