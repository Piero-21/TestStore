import React, { useEffect, useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Modal from './components/Modal';
import Alert from './components/Alert';
import { fetchProducts, fetchCategories } from './services/storeService';
import { Product, Category } from './types';
import { SlidersHorizontal, Loader2, Frown } from 'lucide-react';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // UI State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [alert, setAlert] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  // Initial Data Fetch
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(['all', ...categoriesData]);
      } catch (err) {
        setError('Failed to load products. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Handlers
  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);
    setAlert({ message: `${product.title.substring(0, 20)}... added to cart!`, show: true });
    // If inside modal, we might want to close it or keep it open. Keeping it open is better UX usually.
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        cartCount={cartCount} 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="block mx-auto mt-4 text-indigo-600 hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 h-64">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading catalog...</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Filters */}
            <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex items-center gap-2">
                <div className="bg-white border border-slate-200 p-2 rounded-lg mr-2 shadow-sm">
                  <SlidersHorizontal className="w-5 h-5 text-slate-500" />
                </div>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedCategory === 'all' ? 'All Products' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </h2>
              <span className="text-sm text-slate-500">
                {filteredProducts.length} items found
              </span>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                <Frown className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                <p className="text-slate-500">Try adjusting your search or filter.</p>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} MiniStore. Powered by FakeStoreAPI.</p>
        </div>
      </footer>

      {/* Modal & Alerts */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={handleAddToCart} 
          />
        )}
      </Modal>

      <Alert 
        message={alert.message} 
        isVisible={alert.show} 
        onClose={handleCloseAlert} 
      />
    </div>
  );
};

export default App;