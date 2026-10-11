import React from 'react';

interface SortDropdownProps {
  value: string;
  onChange: (sort: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-neutral-500 whitespace-nowrap">Sort:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 text-xs font-bold bg-white border border-neutral-300 text-black focus:border-black focus:outline-none cursor-pointer rounded-none"
      >
        <option value="latest">Latest</option>
        <option value="price_asc">Price Low → High</option>
        <option value="price_desc">Price High → Low</option>
        <option value="featured">Featured</option>
      </select>
    </div>
  );
};
