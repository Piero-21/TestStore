import React from 'react';
import { Plus, Eye, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-64 p-6 bg-white flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Hover Overlay Buttons */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onViewDetails(product)}
            className="p-3 bg-white rounded-full shadow-lg text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="p-3 bg-indigo-600 rounded-full shadow-lg text-white hover:bg-indigo-700 hover:scale-110 transition-all"
            title="Add to Cart"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-md">
            {product.category}
          </span>
        </div>
        <h3 className="text-sm font-medium text-slate-900 line-clamp-2 mb-2 flex-grow" title={product.title}>
          {product.title}
        </h3>
        
        <div className="flex items-center mb-4">
          <Star className="w-4 h-4 text-amber-400 fill-current" />
          <span className="ml-1 text-xs text-slate-500 font-medium">{product.rating.rate}</span>
          <span className="mx-1 text-slate-300">•</span>
          <span className="text-xs text-slate-400">{product.rating.count} reviews</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors sm:hidden"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;