// Product Data
const products = [
    {
        id: 1,
        name: "Elegant Summer Dress",
        description: "Light and comfortable perfect for summer occasions",
        price: 4499,
        rating: 4.5,
        image: "https://picsum.photos/seed/summer-dress-blue-floral/300/250"
    },
    {
        id: 2,
        name: "Classic Denim Jacket",
        description: "Timeless style with modern comfort and durability",
        price: 3999,
        rating: 4.8,
        image: "https://picsum.photos/seed/denim-jacket-blue-classic/300/250"
    },
    {
        id: 3,
        name: "Stylish Handbag",
        description: "Premium leather handbag with elegant design",
        price: 6499,
        rating: 4.6,
        image: "https://picsum.photos/seed/leather-handbag-brown/300/250"
    },
    {
        id: 4,
        name: "Casual Sneakers",
        description: "Comfortable everyday sneakers with modern look",
        price: 2999,
        rating: 4.3,
        image: "https://picsum.photos/seed/white-sneakers-casual/300/250"
    },
    {
        id: 5,
        name: "Formal Business Suit",
        description: "Professional suit perfect for business meetings",
        price: 9999,
        rating: 4.7,
        image: "https://picsum.photos/seed/business-suit-navy/300/250"
    },
    {
        id: 6,
        name: "Designer Sunglasses",
        description: "UV protection with stylish designer frames",
        price: 4499,
        rating: 4.4,
        image: "https://picsum.photos/seed/designer-sunglasses-black/300/250"
    },
    {
        id: 7,
        name: "Sports T-Shirt",
        description: "Breathable fabric perfect for workouts",
        price: 1499,
        rating: 4.2,
        image: "https://picsum.photos/seed/sports-tshirt-grey/300/250"
    },
    {
        id: 8,
        name: "Leather Wallet",
        description: "Genuine leather wallet with multiple card slots",
        price: 2499,
        rating: 4.5,
        image: "https://picsum.photos/seed/leather-wallet-black/300/250"
    }
];

// Cart Management
let cart = [];
let wishlist = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
    startCarousel();
});

// Load products into the grid
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const isInWishlist = wishlist.includes(product.id);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="rating-value">(${product.rating})</span>
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

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add product to cart
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
    
    updateCartCount();
    updateCartDisplay();
    showNotification('Product added to cart!');
}

// Buy now functionality
function buyNow(productId) {
    addToCart(productId);
    toggleCart();
}

// Toggle wishlist
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist!');
    }
    
    loadProducts(); // Reload products to update wishlist buttons
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = total.toLocaleString('en-IN');
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartCount();
        updateCartDisplay();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
    showNotification('Item removed from cart');
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// Carousel functionality
let currentSlide = 0;
let carouselInterval;

function startCarousel() {
    carouselInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = slideIndex;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    // Reset carousel interval
    clearInterval(carouselInterval);
    startCarousel();
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Setup event listeners
function setupEventListeners() {
    // Cart toggle
    document.querySelector('.nav-link[href="#cart"]').addEventListener('click', function(e) {
        e.preventDefault();
        toggleCart();
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No products found</p>';
            return;
        }
        
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Newsletter form
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        showNotification(`Successfully subscribed with email: ${email}`);
        this.reset();
    });
    
    // User button
    document.getElementById('userBtn').addEventListener('click', function() {
        showNotification('Sign in functionality would be implemented here');
    });
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            showNotification(`Browsing ${category} category`);
            // In a real application, this would filter products by category
        });
    });
    
    // Offer buttons
    document.querySelectorAll('.offer-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Offer details would be displayed here');
        });
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }
        showNotification('Proceeding to checkout...');
        // In a real application, this would navigate to checkout page
    });
}

// Show notification (simple implementation)
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.transform = 'translateX(0)';
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
    }, 3000);
}

// Smooth scroll behavior for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});
