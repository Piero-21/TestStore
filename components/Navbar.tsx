import React from 'react';
import { ShoppingBag, Search, Menu } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, searchTerm, onSearchChange }) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">MiniStore</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* Cart & Menu */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors group">
              <ShoppingBag className="h-6 w-6 text-slate-600 group-hover:text-indigo-600" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-indigo-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;