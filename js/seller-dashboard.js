// Seller Dashboard JavaScript
class SellerDashboard {
    constructor() {
        this.products = this.loadProducts();
        this.orders = this.loadOrders();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardStats();
        this.renderProducts();
        this.renderOrders();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.seller-nav-menu .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(link.getAttribute('href').substring(1));
            });
        });

        // Add Product Modal
        document.getElementById('addProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        // Image Upload
        const imageUploadArea = document.getElementById('imageUploadArea');
        const fileInput = document.getElementById('productImage');

        imageUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = '#ff6b6b';
            imageUploadArea.style.background = 'rgba(255, 107, 107, 0.05)';
        });

        imageUploadArea.addEventListener('dragleave', () => {
            imageUploadArea.style.borderColor = '#ddd';
            imageUploadArea.style.background = 'transparent';
        });

        imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleImageUpload(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files);
        });

        // Search and Filters
        document.getElementById('productSearch').addEventListener('input', (e) => {
            this.filterProducts(e.target.value);
        });

        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filterProducts(e.target.value, 'category');
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filterProducts(e.target.value, 'status');
        });
    }

    switchSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dashboard-stats, .product-management, .order-management, .analytics-section').forEach(section => {
            section.style.display = 'none';
        });

        // Remove active class from nav
        document.querySelectorAll('.seller-nav-menu .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }

        // Add active class to selected nav
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
    }

    loadDashboardStats() {
        // Simulate loading stats data
        const stats = {
            totalProducts: this.products.length,
            totalOrders: this.orders.length,
            totalRevenue: this.calculateTotalRevenue(),
            avgRating: this.calculateAvgRating()
        };

        // Update stats display
        this.updateStatsDisplay(stats);
    }

    updateStatsDisplay(stats) {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers[0].textContent = stats.totalProducts;
        statNumbers[1].textContent = stats.totalOrders;
        statNumbers[2].textContent = `₹${stats.totalRevenue.toLocaleString('en-IN')}`;
        statNumbers[3].textContent = stats.avgRating.toFixed(1);
    }

    calculateTotalRevenue() {
        return this.orders.reduce((total, order) => {
            return total + (order.total || 0);
        }, 0);
    }

    calculateAvgRating() {
        if (this.products.length === 0) return 0;
        const totalRating = this.products.reduce((total, product) => {
            return total + (product.rating || 0);
        }, 0);
        return totalRating / this.products.length;
    }

    loadProducts() {
        const savedProducts = localStorage.getItem('sellerProducts');
        if (savedProducts) {
            return JSON.parse(savedProducts);
        }
        
        // Default sample products
        return [
            {
                id: 1,
                name: 'Elegant Summer Dress',
                category: 'clothing',
                price: 4499,
                stock: 25,
                status: 'active',
                rating: 4.5,
                description: 'Light and comfortable perfect for summer occasions',
                images: ['https://th.bing.com/th/id/OIP.Ct4vouOM2aUpma7rD4H7VAHaHa?&rs=1&pid=ImgDetMain&o=7&rm=3']
            },
            {
                id: 2,
                name: 'Classic Denim Jacket',
                category: 'clothing',
                price: 3999,
                stock: 15,
                status: 'active',
                rating: 4.8,
                description: 'Timeless style with modern comfort and durability',
                images: ['https://assets.digitalcontent.marksandspencer.app/images/w_1024,q_auto,f_auto/SD_10_T18_4782_E0_X_EC_0/Classic-Denim-Jacket']
            },
            {
                id: 3,
                name: 'Stylish Handbag',
                category: 'accessories',
                price: 6499,
                stock: 8,
                status: 'active',
                rating: 4.6,
                description: 'Premium leather handbag with elegant design',
                images: ['https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/091544/01/mod02/fnd/IND/fmt/png/PU-Zen-Women\'s-Handbag']
            },
            {
                id: 4,
                name: 'Casual Sneakers',
                category: 'footwear',
                price: 2999,
                stock: 0,
                status: 'out-of-stock',
                rating: 4.3,
                description: 'Comfortable everyday sneakers with modern look',
                images: ['https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/394371/03/fnd/IND/fmt/png/Smashic-Comfort-Casual-Sneakers']
            }
        ];
    }

    loadOrders() {
        const savedOrders = localStorage.getItem('sellerOrders');
        if (savedOrders) {
            return JSON.parse(savedOrders);
        }
        
        // Default sample orders
        return [
            {
                id: 1,
                orderNumber: 'ORD-2024-001',
                customer: 'Rahul Kumar',
                date: '2024-01-15',
                total: 4499,
                status: 'completed',
                items: ['Elegant Summer Dress']
            },
            {
                id: 2,
                orderNumber: 'ORD-2024-002',
                customer: 'Priya Sharma',
                date: '2024-01-16',
                total: 3999,
                status: 'processing',
                items: ['Classic Denim Jacket']
            },
            {
                id: 3,
                orderNumber: 'ORD-2024-003',
                customer: 'Amit Patel',
                date: '2024-01-17',
                total: 6499,
                status: 'pending',
                items: ['Stylish Handbag']
            }
        ];
    }

    renderProducts() {
        const productsGrid = document.getElementById('sellerProductsGrid');
        productsGrid.innerHTML = '';

        this.products.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'seller-product-card';
        
        const statusClass = product.status === 'active' ? 'status-active' : 
                           product.status === 'inactive' ? 'status-inactive' : 'status-out-of-stock';
        
        card.innerHTML = `
            <div class="seller-product-header">
                <div class="seller-product-title">${product.name}</div>
                <span class="seller-product-status ${statusClass}">${this.formatStatus(product.status)}</span>
            </div>
            <div class="seller-product-details">
                <div class="detail-item">
                    <span class="detail-label">Category</span>
                    <span class="detail-value">${this.formatCategory(product.category)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Price</span>
                    <span class="detail-value">₹${product.price.toLocaleString('en-IN')}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Stock</span>
                    <span class="detail-value">${product.stock} units</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Rating</span>
                    <span class="detail-value">⭐ ${product.rating}</span>
                </div>
            </div>
            <div class="seller-product-actions">
                <button class="action-btn edit-btn" onclick="sellerDashboard.editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="sellerDashboard.deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        return card;
    }

    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    filterProducts(searchTerm = '', filterType = '', filterValue = '') {
        let filteredProducts = [...this.products];

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType === 'category' && filterValue) {
            filteredProducts = filteredProducts.filter(product => product.category === filterValue);
        }

        if (filterType === 'status' && filterValue) {
            filteredProducts = filteredProducts.filter(product => product.status === filterValue);
        }

        this.renderFilteredProducts(filteredProducts);
    }

    renderFilteredProducts(products) {
        const productsGrid = document.getElementById('sellerProductsGrid');
        productsGrid.innerHTML = '';

        if (products.length === 0) {
            productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #666;">No products found</p>';
            return;
        }

        products.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    renderOrders() {
        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = '';

        this.orders.forEach(order => {
            const orderCard = this.createOrderCard(order);
            ordersList.appendChild(orderCard);
        });
    }

    createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        
        const statusClass = order.status === 'completed' ? 'status-active' : 
                           order.status === 'processing' ? 'status-active' : 'status-inactive';
        
        card.innerHTML = `
            <div class="order-header">
                <span class="order-id">${order.orderNumber}</span>
                <span class="order-status ${statusClass}">${this.formatStatus(order.status)}</span>
            </div>
            <div class="order-details">
                <div class="detail-item">
                    <span class="detail-label">Customer</span>
                    <span class="detail-value">${order.customer}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">${order.date}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total</span>
                    <span class="detail-value">₹${order.total.toLocaleString('en-IN')}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Items</span>
                    <span class="detail-value">${order.items.join(', ')}</span>
                </div>
            </div>
        `;
        
        return card;
    }

    addProduct() {
        const formData = new FormData(document.getElementById('addProductForm'));
        
        const newProduct = {
            id: Date.now(),
            name: formData.get('productName'),
            category: formData.get('productCategory'),
            price: parseFloat(formData.get('productPrice')),
            stock: parseInt(formData.get('productStock')),
            description: formData.get('productDescription'),
            status: 'active',
            rating: 0,
            images: []
        };

        // Validation
        if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        this.products.push(newProduct);
        this.saveProducts();
        this.renderProducts();
        this.loadDashboardStats();
        this.closeAddProductModal();
        this.showNotification('Product added successfully!', 'success');
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Populate form with existing data
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDescription').value = product.description;

        this.openAddProductModal();
        this.showNotification('Edit the product details and submit to update', 'info');
    }

    deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        this.products = this.products.filter(p => p.id !== productId);
        this.saveProducts();
        this.renderProducts();
        this.loadDashboardStats();
        this.showNotification('Product deleted successfully!', 'success');
    }

    saveProducts() {
        localStorage.setItem('sellerProducts', JSON.stringify(this.products));
    }

    saveOrders() {
        localStorage.setItem('sellerOrders', JSON.stringify(this.orders));
    }

    openAddProductModal() {
        document.getElementById('addProductModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAddProductModal() {
        document.getElementById('addProductModal').classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form
        document.getElementById('addProductForm').reset();
        document.getElementById('imageUploadArea').innerHTML = `
            <input type="file" id="productImage" accept="image/*" multiple style="display: none;">
            <div class="upload-placeholder">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Click to upload images or drag and drop</p>
                <span>Maximum 5 images, each up to 5MB</span>
            </div>
        `;
    }

    handleImageUpload(files) {
        const uploadArea = document.getElementById('imageUploadArea');
        const validFiles = Array.from(files).filter(file => 
            file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length > 0) {
            const fileNames = validFiles.map(file => file.name).join(', ');
            uploadArea.innerHTML = `
                <div class="upload-success">
                    <i class="fas fa-check-circle"></i>
                    <p>${validFiles.length} file(s) selected: ${fileNames}</p>
                </div>
            `;
            uploadArea.style.borderColor = '#4caf50';
            uploadArea.style.background = 'rgba(76, 175, 80, 0.1)';
        } else {
            this.showNotification('Please select valid image files (max 5MB each)', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44436' : '#2196f3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize dashboard
const sellerDashboard = new SellerDashboard();
