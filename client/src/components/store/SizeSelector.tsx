import React from 'react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
}) => {
  const sizeDescriptions: Record<string, string> = {
    A4: '21 × 30 cm',
    A3: '30 × 42 cm',
    A2: '42 × 59 cm',
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
        Size
      </span>
      <div className="grid grid-cols-3 gap-3">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const dimension = sizeDescriptions[size] || 'Standard';

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`p-3 text-center border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-black bg-[#5CE1E6] shadow-[3px_3px_0px_0px_#000000] font-black'
                  : 'border-neutral-300 bg-white hover:border-black font-bold text-neutral-800'
              }`}
            >
              <div className="text-sm font-black">{size}</div>
              <div className="text-[10px] text-neutral-600 mt-0.5">{dimension}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
