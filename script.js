// --- CONFIGURACIÓN ---
const API_URL = 'https://fakestoreapi.com/products';
let allProducts = [];
let cartCount = 0;
let currentCategory = 'all';

// --- INICIALIZACIÓN ---
// Aseguramos que el código corra cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// --- FUNCIONES GLOBALES (necesarias para los onclick en HTML) ---
window.setCategory = function(category, btnElement) {
    currentCategory = category;
    
    // Reset visual de botones
    document.querySelectorAll('.category-btn').forEach(b => {
        b.className = 'category-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all';
    });

    // Activar botón seleccionado
    if (btnElement) {
        btnElement.className = 'category-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-indigo-600 bg-indigo-600 text-white shadow-md transition-all';
    } else {
        // Si no se pasa elemento, activamos el botón "Todos"
        const allBtn = document.querySelector('button[onclick="setCategory(\'all\')"]');
        if(allBtn) allBtn.className = 'category-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-indigo-600 bg-indigo-600 text-white shadow-md transition-all';
    }

    filterProducts();
};

window.resetFilter = function() {
    const searchInput = document.getElementById('search-input');
    if(searchInput) searchInput.value = '';
    window.setCategory('all');
};

window.filterProducts = function() {
    const searchInput = document.getElementById('search-input');
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filtered = allProducts.filter(p => {
        const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.title.toLowerCase().includes(term);
        return matchesCategory && matchesSearch;
    });

    renderProducts(filtered);
};

window.addToCart = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    cartCount++;
    const badge = document.getElementById('cart-badge');
    if(badge) {
        badge.innerText = cartCount;
        badge.classList.remove('opacity-0');
    }
    
    showToast(`Agregado: ${product.title.substring(0, 20)}...`);
};

window.openModal = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <div class="w-full md:w-1/2 p-8 bg-white flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
            <img src="${product.image}" alt="${product.title}" class="max-h-[300px] object-contain">
        </div>
        <div class="w-full md:w-1/2 p-8 flex flex-col h-full overflow-y-auto">
            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">${product.category}</span>
            <h2 class="text-2xl font-bold text-slate-900 mb-4">${product.title}</h2>
            <p class="text-slate-600 mb-6 leading-relaxed text-sm">${product.description}</p>
            
            <div class="mt-auto pt-6 border-t border-slate-100">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-3xl font-bold text-slate-900">$${product.price.toFixed(2)}</span>
                    <div class="flex items-center text-amber-400">
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <span class="ml-1 text-slate-600 font-bold">${product.rating.rate}</span>
                    </div>
                </div>
                <button onclick="addToCart(${product.id})" class="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if(window.lucide) lucide.createIcons();
};

window.closeModal = function() {
    document.getElementById('modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
};

// --- LÓGICA INTERNA ---

async function fetchProducts() {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('products-grid');

    try {
        const res = await fetch(API_URL);
        if(!res.ok) throw new Error('Error de red');
        
        allProducts = await res.json();
        
        // Cargar filtros de categorías
        initCategories();
        
        // Renderizar productos
        loading.classList.add('hidden');
        renderProducts(allProducts);
        
    } catch (error) {
        console.error(error);
        loading.innerHTML = `
            <div class="text-center text-red-500">
                <p class="font-bold">Hubo un error al cargar los productos.</p>
                <p class="text-sm">Por favor intenta recargar la página.</p>
            </div>
        `;
    }
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full fade-in';
        
        // Incluye las opciones flotantes que pediste (Ver Detalle y +)
        div.innerHTML = `
            <div class="relative h-64 p-6 bg-white flex items-center justify-center overflow-hidden">
                <img src="${product.image}" alt="${product.title}" class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110">
                
                <!-- Botones Hover (Opciones flotantes) -->
                <div class="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button onclick="openModal(${product.id})" class="p-3 bg-white rounded-full shadow-lg text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all" title="Ver Detalle">
                        <i data-lucide="eye" class="w-5 h-5"></i>
                    </button>
                    <button onclick="addToCart(${product.id})" class="p-3 bg-indigo-600 rounded-full shadow-lg text-white hover:bg-indigo-700 hover:scale-110 transition-all" title="Agregar rápido">
                        <i data-lucide="plus" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-5 flex flex-col flex-grow">
                <div class="mb-2">
                    <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-md">${product.category}</span>
                </div>
                <h3 class="text-sm font-medium text-slate-900 line-clamp-2 mb-2 flex-grow">${product.title}</h3>
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span class="text-lg font-bold text-slate-900">$${product.price.toFixed(2)}</span>
                    <button onclick="addToCart(${product.id})" class="text-sm font-medium text-indigo-600 hover:text-indigo-800 sm:hidden">Agregar</button>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });

    if(window.lucide) lucide.createIcons();
}

function initCategories() {
    const cats = ['all', ...new Set(allProducts.map(p => p.category))];
    const container = document.getElementById('category-filters');
    container.innerHTML = ''; 

    cats.forEach(c => {
        const btn = document.createElement('button');
        const label = c === 'all' ? 'Todos' : c.charAt(0).toUpperCase() + c.slice(1);
        btn.innerText = label;
        btn.onclick = () => window.setCategory(c, btn);
        
        // Estilos base
        btn.className = c === 'all' 
            ? 'category-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-indigo-600 bg-indigo-600 text-white shadow-md transition-all'
            : 'category-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all';
            
        container.appendChild(btn);
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const text = document.getElementById('toast-message');
    text.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}