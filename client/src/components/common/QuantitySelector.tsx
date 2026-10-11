import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  max = 10,
}) => {
  return (
    <div className="inline-flex items-center border-2 border-black bg-white">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="px-2.5 py-1 text-black hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="px-3 py-1 font-bold text-sm min-w-8 text-center select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="px-2.5 py-1 text-black hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
