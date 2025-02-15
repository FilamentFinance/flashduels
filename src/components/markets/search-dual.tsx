import { Input } from '@/shadcn/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

interface SearchDuelsProps {
  placeholder: string;
}

const SearchDuels: React.FC<SearchDuelsProps> = ({ placeholder }) => {
  return (
    <div className="flex gap-10 items-center px-5 py-2 rounded-xl border border-solid bg-white bg-opacity-0 border-white border-opacity-10 shadow-[0px_2px_10px_rgba(0,0,0,0.25)]">
      <label htmlFor="searchInput" className="sr-only">
        Search Duels
      </label>
      <Input
        id="searchInput"
        type="text"
        className="flex-grow bg-transparent text-xl text-stone-500  border-none outline-none active:outline-none"
        placeholder={placeholder}
      />
      <Search className="w-8 h-8 text-stone-500" />
    </div>
  );
};

export default SearchDuels;
