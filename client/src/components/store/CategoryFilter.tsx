import React from 'react';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onSelectCategory('')}
        className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
          selectedCategory === ''
            ? 'bg-[#5CE1E6] text-black border-black shadow-[2px_2px_0px_0px_#000000]'
            : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
        }`}
      >
        All
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        return (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
              isSelected
                ? 'bg-[#5CE1E6] text-black border-black shadow-[2px_2px_0px_0px_#000000]'
                : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
