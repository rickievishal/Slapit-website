import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search posters...',
}) => {
  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-3 w-4 h-4 text-neutral-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-neutral-300 focus:border-black focus:outline-none transition-colors rounded-none placeholder:text-neutral-400"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 p-1 text-neutral-400 hover:text-black transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
