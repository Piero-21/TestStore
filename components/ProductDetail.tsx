import React from 'react';
import { Star, ShoppingCart, Check, Truck, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 lg:p-10">
      {/* Image Section */}
      <div className="flex items-center justify-center bg-white p-6 rounded-xl border border-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-[400px] w-auto object-contain"
        />
      </div>

      {/* Details Section */}
      <div className="flex flex-col">
        <div className="mb-4">
           <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full uppercase tracking-wide">
            {product.category}
          </span>
        </div>
       
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">
          {product.title}
        </h2>

        <div className="flex items-center mb-6">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(product.rating.rate) ? 'fill-current' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-slate-600">
            {product.rating.rate} <span className="text-slate-300">|</span> {product.rating.count} reviews
          </span>
        </div>

        <p className="text-slate-600 mb-8 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
            <span className="text-sm text-slate-500 mb-2">Free Shipping</span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                    <Truck className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Fast Delivery</h4>
                    <p className="text-xs text-slate-500">2-3 business days</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Warranty</h4>
                    <p className="text-xs text-slate-500">2 year guarantee</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;