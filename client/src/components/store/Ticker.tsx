import React from 'react';
import { motion } from 'framer-motion';

export const Ticker: React.FC = () => {
  const items = [
    '★ PRINTS ON DEMAND',
    '★ PREMIUM QUALITY',
    '★ SHIPPED ACROSS INDIA',
    '★ 300 GSM MATTE FINISH',
    '★ ARCHIVAL INKS',
    '★ DAMAGE-FREE PACKAGING',
  ];

  return (
    <div className="w-full bg-[#5CE1E6] border-y-2 border-black py-2.5 overflow-hidden select-none">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        className="flex whitespace-nowrap text-xs sm:text-sm font-black tracking-widest text-black uppercase"
      >
        <div className="flex gap-8 shrink-0 pr-8">
          {items.map((item, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {item}
            </span>
          ))}
        </div>
        <div className="flex gap-8 shrink-0 pr-8">
          {items.map((item, idx) => (
            <span key={`clone-${idx}`} className="flex items-center gap-2">
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
