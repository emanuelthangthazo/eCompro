// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.products = this.loadProducts();
        this.orders = this.loadOrders();
        this.reviews = this.loadReviews();
        this.users = this.loadUsers();
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.renderProducts();
        this.renderOrders();
        this.renderReviews();
        this.renderUsers();
    }

    setupEventListeners() {
        // Product form submission
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Close modal on background click
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target.id === 'productModal') {
                this.closeProductModal();
            }
        });
    }

    // Navigation
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });

        // Remove active class from nav links
        document.querySelectorAll('.admin-nav-menu .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName + '-section').style.display = 'block';
        
        // Add active class to selected nav link
        document.querySelector(`[onclick="showSection('${sectionName}')"]`).classList.add('active');
        
        this.currentSection = sectionName;
    }

    // Data Management
    loadProducts() {
        const savedProducts = localStorage.getItem('adminProducts');
        if (savedProducts) {
            return JSON.parse(savedProducts);
        }
        
        // Default products
        return [
            {
                id: 1,
                name: "Elegant Summer Dress",
                category: "clothing",
                price: 4499,
                stock: 25,
                status: "active",
                description: "Light and comfortable perfect for summer occasions"
            },
            {
                id: 2,
                name: "Classic Denim Jacket",
                category: "clothing",
                price: 3999,
                stock: 15,
                status: "active",
                description: "Timeless style with modern comfort and durability"
            },
            {
                id: 3,
                name: "Stylish Handbag",
                category: "accessories",
                price: 6499,
                stock: 8,
                status: "active",
                description: "Premium leather handbag with elegant design"
            },
            {
                id: 4,
                name: "Casual Sneakers",
                category: "footwear",
                price: 2999,
                stock: 0,
                status: "out-of-stock",
                description: "Comfortable everyday sneakers with modern look"
            },
            {
                id: 5,
                name: "Formal Business Suit",
                category: "clothing",
                price: 9999,
                stock: 12,
                status: "active",
                description: "Professional suit perfect for business meetings"
            },
            {
                id: 6,
                name: "Designer Sunglasses",
                category: "accessories",
                price: 4499,
                stock: 20,
                status: "active",
                description: "UV protection with stylish designer frames"
            }
        ];
    }

    loadOrders() {
        const savedOrders = localStorage.getItem('adminOrders');
        if (savedOrders) {
            return JSON.parse(savedOrders);
        }
        
        // Default orders
        return [
            {
                id: 1,
                orderNumber: "ORD-2024-001",
                customer: "Rahul Kumar",
                customerEmail: "rahul@email.com",
                products: ["Elegant Summer Dress"],
                total: 4499,
                status: "delivered",
                date: "2024-01-15"
            },
            {
                id: 2,
                orderNumber: "ORD-2024-002",
                customer: "Priya Sharma",
                customerEmail: "priya@email.com",
                products: ["Classic Denim Jacket"],
                total: 3999,
                status: "processing",
                date: "2024-01-16"
            },
            {
                id: 3,
                orderNumber: "ORD-2024-003",
                customer: "Amit Patel",
                customerEmail: "amit@email.com",
                products: ["Stylish Handbag"],
                total: 6499,
                status: "pending",
                date: "2024-01-17"
            },
            {
                id: 4,
                orderNumber: "ORD-2024-004",
                customer: "Neha Gupta",
                customerEmail: "neha@email.com",
                products: ["Casual Sneakers"],
                total: 2999,
                status: "shipped",
                date: "2024-01-18"
            }
        ];
    }

    loadReviews() {
        const savedReviews = localStorage.getItem('adminReviews');
        if (savedReviews) {
            return JSON.parse(savedReviews);
        }
        
        // Default reviews
        return [
            {
                id: 1,
                product: "Elegant Summer Dress",
                customer: "Sarah Johnson",
                rating: 5,
                review: "Absolutely love this dress! The fabric is amazing and it fits perfectly. Great quality for the price.",
                date: "2024-01-10",
                status: "approved"
            },
            {
                id: 2,
                product: "Classic Denim Jacket",
                customer: "Mike Chen",
                rating: 4,
                review: "Good quality jacket, but sizing runs a bit small. Overall happy with purchase.",
                date: "2024-01-11",
                status: "approved"
            },
            {
                id: 3,
                product: "Stylish Handbag",
                customer: "Emma Wilson",
                rating: 3,
                review: "The bag looks nice but the leather quality could be better. It's okay for the price.",
                date: "2024-01-12",
                status: "pending"
            },
            {
                id: 4,
                product: "Casual Sneakers",
                customer: "John Davis",
                rating: 5,
                review: "Most comfortable sneakers I've ever owned! Highly recommend.",
                date: "2024-01-13",
                status: "approved"
            }
        ];
    }

    loadUsers() {
        const savedUsers = localStorage.getItem('adminUsers');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
        
        // Default users
        return [
            {
                id: 1,
                name: "Rahul Kumar",
                email: "rahul@email.com",
                role: "customer",
                orders: 3,
                joined: "2024-01-01"
            },
            {
                id: 2,
                name: "Priya Sharma",
                email: "priya@email.com",
                role: "customer",
                orders: 5,
                joined: "2024-01-05"
            },
            {
                id: 3,
                name: "Amit Patel",
                email: "amit@email.com",
                role: "customer",
                orders: 2,
                joined: "2024-01-10"
            },
            {
                id: 4,
                name: "Admin User",
                email: "admin@bizzarefashion.com",
                role: "admin",
                orders: 0,
                joined: "2023-12-01"
            }
        ];
    }

    // Dashboard Data
    loadDashboardData() {
        const stats = {
            totalProducts: this.products.length,
            totalOrders: this.orders.length,
            totalRevenue: this.calculateTotalRevenue(),
            avgRating: this.calculateAvgRating()
        };

        // Update dashboard stats
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        document.getElementById('totalOrders').textContent = stats.totalOrders;
        document.getElementById('totalRevenue').textContent = `₹${stats.totalRevenue.toLocaleString('en-IN')}`;
        document.getElementById('avgRating').textContent = stats.avgRating.toFixed(1);
    }

    calculateTotalRevenue() {
        return this.orders.reduce((total, order) => {
            return total + order.total;
        }, 0);
    }

    calculateAvgRating() {
        if (this.reviews.length === 0) return 0;
        const totalRating = this.reviews.reduce((total, review) => {
            return total + review.rating;
        }, 0);
        return totalRating / this.reviews.length;
    }

    // Product Management
    renderProducts() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="product-info">
                        <strong>${product.name}</strong><br>
                        <small>${product.description.substring(0, 50)}...</small>
                    </div>
                </td>
                <td>${this.formatCategory(product.category)}</td>
                <td>₹${product.price.toLocaleString('en-IN')}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge status-${product.status}">${this.formatStatus(product.status)}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="adminDashboard.editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="adminDashboard.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Order Management
    renderOrders() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${order.orderNumber}</strong></td>
                <td>
                    <div>${order.customer}</div>
                    <small>${order.customerEmail}</small>
                </td>
                <td>${order.products.join(', ')}</td>
                <td>₹${order.total.toLocaleString('en-IN')}</td>
                <td><span class="status-badge status-${order.status}">${this.formatStatus(order.status)}</span></td>
                <td>${order.date}</td>
                <td>
                    <select class="status-select" onchange="adminDashboard.updateOrderStatus(${order.id}, this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Review Management
    renderReviews() {
        const tbody = document.getElementById('reviewsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.reviews.forEach(review => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="product-info">
                        <strong>${review.product}</strong>
                    </div>
                </td>
                <td>
                    <div>${review.customer}</div>
                    <small>${review.date}</small>
                </td>
                <td>
                    <div class="rating-display">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        <span>(${review.rating}/5)</span>
                    </div>
                </td>
                <td>
                    <div class="review-text">${review.review.substring(0, 100)}...</div>
                </td>
                <td><span class="status-badge status-${review.status}">${this.formatStatus(review.status)}</span></td>
                <td>
                    <button class="action-btn approve-btn" onclick="adminDashboard.approveReview(${review.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="action-btn reject-btn" onclick="adminDashboard.rejectReview(${review.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // User Management
    renderUsers() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="user-info">
                        <strong>${user.name}</strong>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="status-badge status-${user.role === 'admin' ? 'active' : 'pending'}">${user.role}</span></td>
                <td>${user.orders}</td>
                <td>${user.joined}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="adminDashboard.editUser(${user.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="adminDashboard.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Product Modal Functions
    openAddProductModal() {
        document.getElementById('modalTitle').textContent = 'Add Product';
        document.getElementById('productForm').reset();
        document.getElementById('productModal').classList.add('active');
    }

    closeProductModal() {
        document.getElementById('productModal').classList.remove('active');
    }

    saveProduct() {
        const formData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            description: document.getElementById('productDescription').value,
            status: 'active'
        };

        if (!formData.name || !formData.category || !formData.price || !formData.stock) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Add new product
        const newProduct = {
            id: Date.now(),
            ...formData
        };

        this.products.push(newProduct);
        this.saveProducts();
        this.renderProducts();
        this.loadDashboardData();
        this.closeProductModal();
        this.showNotification('Product added successfully!', 'success');
    }

    // CRUD Operations
    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Populate form with product data
        document.getElementById('modalTitle').textContent = 'Edit Product';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDescription').value = product.description;

        document.getElementById('productModal').classList.add('active');

        // Update form submission handler
        const form = document.getElementById('productForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.updateProduct(productId);
        };
    }

    updateProduct(productId) {
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex === -1) return;

        const updatedProduct = {
            ...this.products[productIndex],
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            description: document.getElementById('productDescription').value
        };

        this.products[productIndex] = updatedProduct;
        this.saveProducts();
        this.renderProducts();
        this.loadDashboardData();
        this.closeProductModal();
        this.showNotification('Product updated successfully!', 'success');

        // Reset form handler
        document.getElementById('productForm').onsubmit = (e) => {
            e.preventDefault();
            this.saveProduct();
        };
    }

    deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        this.products = this.products.filter(p => p.id !== productId);
        this.saveProducts();
        this.renderProducts();
        this.loadDashboardData();
        this.showNotification('Product deleted successfully!', 'success');
    }

    updateOrderStatus(orderId, newStatus) {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;

        this.orders[orderIndex].status = newStatus;
        this.saveOrders();
        this.renderOrders();
        this.showNotification('Order status updated successfully!', 'success');
    }

    approveReview(reviewId) {
        const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
        if (reviewIndex === -1) return;

        this.reviews[reviewIndex].status = 'approved';
        this.saveReviews();
        this.renderReviews();
        this.showNotification('Review approved successfully!', 'success');
    }

    rejectReview(reviewId) {
        const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
        if (reviewIndex === -1) return;

        this.reviews[reviewIndex].status = 'rejected';
        this.saveReviews();
        this.renderReviews();
        this.showNotification('Review rejected successfully!', 'success');
    }

    editUser(userId) {
        this.showNotification('User editing coming soon!', 'info');
    }

    deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        this.users = this.users.filter(u => u.id !== userId);
        this.saveUsers();
        this.renderUsers();
        this.showNotification('User deleted successfully!', 'success');
    }

    // Filter Functions
    filterOrders() {
        const status = document.getElementById('orderStatusFilter').value;
        const rows = document.querySelectorAll('#ordersTableBody tr');
        
        rows.forEach(row => {
            const rowStatus = row.querySelector('.status-badge').textContent.toLowerCase();
            if (!status || rowStatus === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    filterReviews() {
        const status = document.getElementById('reviewStatusFilter').value;
        const rows = document.querySelectorAll('#reviewsTableBody tr');
        
        rows.forEach(row => {
            const rowStatus = row.querySelector('.status-badge').textContent.toLowerCase();
            if (!status || rowStatus === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Utility Functions
    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.background = '#4caf50';
        } else if (type === 'error') {
            notification.style.background = '#f44436';
        } else {
            notification.style.background = '#2196f3';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Save Functions
    saveProducts() {
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
    }

    saveOrders() {
        localStorage.setItem('adminOrders', JSON.stringify(this.orders));
    }

    saveReviews() {
        localStorage.setItem('adminReviews', JSON.stringify(this.reviews));
    }

    saveUsers() {
        localStorage.setItem('adminUsers', JSON.stringify(this.users));
    }

    // Logout
    adminLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'index.html';
        }
    }
}

// Initialize admin dashboard
const adminDashboard = new AdminDashboard();

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    adminDashboard.showSection(sectionName);
}

function openAddProductModal() {
    adminDashboard.openAddProductModal();
}

function closeProductModal() {
    adminDashboard.closeProductModal();
}

function adminLogout() {
    adminDashboard.adminLogout();
}
