import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PosterGalleryProps {
  images: string[];
  productName: string;
}

export const PosterGallery: React.FC<PosterGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : ['https://placehold.co/600x800/1a1a1a/5CE1E6?text=Poster'];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails strip */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-y-auto">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(idx)}
              className={`w-16 h-22 sm:w-20 sm:h-26 border-2 shrink-0 overflow-hidden cursor-pointer transition-all ${
                selectedImage === idx
                  ? 'border-black shadow-[3px_3px_0px_0px_#5CE1E6]'
                  : 'border-neutral-300 opacity-70 hover:opacity-100 hover:border-black'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Preview with Frame Effect matching Panel 03 */}
      <div className="flex-1 bg-[#FAFAFA] p-4 sm:p-8 border-2 border-black shadow-[6px_6px_0px_0px_#000000] flex items-center justify-center">
        <div className="relative max-w-md w-full aspect-3/4 border-4 border-black bg-white shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={displayImages[selectedImage]}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
