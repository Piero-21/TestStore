// --- DATOS DE RESPALDO (Por si la API falla o tarda) ---
const FALLBACK_PRODUCTS = [
    {
        "id": 1,
        "title": "Fjallraven - Foldsack No. 1 Backpack",
        "price": 109.95,
        "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        "rating": { "rate": 3.9, "count": 120 }
    },
    {
        "id": 2,
        "title": "Mens Casual Premium Slim Fit T-Shirts ",
        "price": 22.3,
        "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        "rating": { "rate": 4.1, "count": 259 }
    },
    {
        "id": 3,
        "title": "Mens Cotton Jacket",
        "price": 55.99,
        "description": "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
        "rating": { "rate": 4.7, "count": 500 }
    },
    {
        "id": 5,
        "title": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
        "price": 695,
        "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
        "category": "jewelery",
        "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        "rating": { "rate": 4.6, "count": 400 }
    },
    {
        "id": 6,
        "title": "Solid Gold Petite Micropave ",
        "price": 168,
        "description": "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
        "category": "jewelery",
        "image": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
        "rating": { "rate": 3.9, "count": 70 }
    },
    {
        "id": 9,
        "title": "WD 2TB Elements Portable External Hard Drive - USB 3.0 ",
        "price": 64,
        "description": "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7.",
        "category": "electronics",
        "image": "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
        "rating": { "rate": 3.3, "count": 203 }
    },
    {
        "id": 10,
        "title": "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
        "price": 109,
        "description": "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores).",
        "category": "electronics",
        "image": "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
        "rating": { "rate": 2.9, "count": 470 }
    }
];

// --- CONFIGURACIÓN ---
const API_URL = 'https://fakestoreapi.com/products';
let allProducts = [];
let cartCount = 0;
let currentCategory = 'all';

// --- INICIALIZACIÓN ---
// Ejecutar inmediatamente, no esperar a DOMContentLoaded para evitar conflictos en CodePen/Github Pages
init();

async function init() {
    await fetchProducts();
    // Inicializar iconos
    if(window.lucide) lucide.createIcons();
}

// --- FUNCIONES GLOBALES (expuestas a window para HTML) ---

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
    
    try {
        // Intentamos cargar la API
        const res = await fetch(API_URL);
        if(!res.ok) throw new Error('Error de red');
        allProducts = await res.json();
    } catch (error) {
        console.warn('API falló o tardó, usando datos locales de respaldo', error);
        // Si falla, usamos los datos hardcodeados para asegurar que SE VEA ALGO
        allProducts = FALLBACK_PRODUCTS;
    } finally {
        // Cargar filtros de categorías y renderizar
        initCategories();
        if(loading) loading.classList.add('hidden');
        renderProducts(allProducts);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    
    if(!grid) return;

    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.classList.add('hidden');
        if(emptyState) emptyState.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    if(emptyState) emptyState.classList.add('hidden');

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full fade-in';
        
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
    if(allProducts.length === 0) return;
    
    const cats = ['all', ...new Set(allProducts.map(p => p.category))];
    const container = document.getElementById('category-filters');
    if(!container) return;

    container.innerHTML = ''; 

    cats.forEach(c => {
        const btn = document.createElement('button');
        const label = c === 'all' ? 'Todos' : c.charAt(0).toUpperCase() + c.slice(1);
        btn.innerText = label;
        btn.onclick = () => window.setCategory(c, btn);
        
        btn.className = c === 'all' 
            ? 'category-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-indigo-600 bg-indigo-600 text-white shadow-md transition-all'
            : 'category-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all';
            
        container.appendChild(btn);
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const text = document.getElementById('toast-message');
    if(!toast || !text) return;

    text.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}