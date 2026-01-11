// Product Data - Fixed Version
const products = [
    {
        id: 1,
        name: "Elegant Summer Dress",
        description: "Light and comfortable perfect for summer occasions",
        price: 4499,
        rating: 4.5,
        image: "https://picsum.photos/seed/dress1/400/500"
    },
    {
        id: 2,
        name: "Classic Denim Jacket",
        description: "Timeless style with modern comfort and durability",
        price: 3999,
        rating: 4.8,
        image: "https://picsum.photos/seed/jacket1/400/500"
    },
    {
        id: 3,
        name: "Stylish Handbag",
        description: "Premium leather handbag with elegant design",
        price: 6499,
        rating: 4.6,
        image: "https://picsum.photos/seed/handbag1/400/500"
    },
    {
        id: 4,
        name: "Casual Sneakers",
        description: "Comfortable everyday sneakers with modern look",
        price: 2999,
        rating: 4.3,
        image: "https://picsum.photos/seed/sneakers1/400/500"
    },
    {
        id: 5,
        name: "Formal Business Suit",
        description: "Professional suit perfect for business meetings",
        price: 9999,
        rating: 4.7,
        image: "https://picsum.photos/seed/suit1/400/500"
    },
    {
        id: 6,
        name: "Designer Sunglasses",
        description: "UV protection with stylish designer frames",
        price: 4499,
        rating: 4.4,
        image: "https://picsum.photos/seed/sunglasses1/400/500"
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const cartIcon = document.querySelector('.cart-count');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const closeCartBtn = document.querySelector('.close-cart');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCount();
    
    // Cart event listeners
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }
});

// Render products
function renderProducts() {
    const productsGrid = document.querySelector('.product-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                <i class="far fa-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <span class="stars">${'★'.repeat(Math.floor(product.rating))}</span>
                <span class="rating-value">${product.rating}</span>
            </div>
            <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="buy-now" onclick="buyNow(${product.id})">Buy Now</button>
            </div>
        </div>
    `;
    
    return card;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Product added to cart!');
}

// Buy now
function buyNow(productId) {
    addToCart(productId);
    openCart();
}

// Update cart
function updateCart() {
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString('en-IN');
    }
    
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
    if (cartIcon) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartIcon.textContent = count;
    }
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Product removed from cart');
}

// Open/close cart
function openCart() {
    if (cartSidebar) {
        cartSidebar.classList.add('open');
    }
}

function closeCart() {
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
}

// Search products
function searchProducts(e) {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productDesc = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Toggle wishlist
function toggleWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Initialize cart on load
loadCart();

// Navigation functions
function showProfile() {
    showNotification('Profile page coming soon!');
}

function showOrders() {
    showNotification('Orders page coming soon!');
}

function showWishlist() {
    showNotification('Wishlist page coming soon!');
}

function showSettings() {
    showNotification('Settings page coming soon!');
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    location.reload();
}
