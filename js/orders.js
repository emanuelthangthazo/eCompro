// Orders Management System
class OrdersManager {
    constructor() {
        this.orders = [];
        this.filteredOrders = [];
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupEventListeners();
        this.renderOrders();
    }

    loadOrders() {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            this.orders = JSON.parse(savedOrders);
        } else {
            // Add sample orders for demo
            this.orders = [
                {
                    id: 'BF1642123456789',
                    items: [
                        {
                            id: 1,
                            name: 'Elegant Summer Dress',
                            price: 2999,
                            quantity: 2,
                            image: 'https://picsum.photos/seed/dress1/80/80'
                        }
                    ],
                    address: {
                        fullName: 'John Doe',
                        phone: '+91 9876543210',
                        address: '123 Main Street',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        pincode: '400001',
                        country: 'India'
                    },
                    delivery: 'standard',
                    payment: 'card',
                    subtotal: 5998,
                    shipping: 50,
                    tax: 1080,
                    discount: 600,
                    total: 6528,
                    status: 'delivered',
                    orderDate: new Date('2024-01-10').toISOString(),
                    estimatedDelivery: new Date('2024-01-17').toISOString()
                },
                {
                    id: 'BF1641987654321',
                    items: [
                        {
                            id: 2,
                            name: 'Casual T-Shirt',
                            price: 899,
                            quantity: 1,
                            image: 'https://picsum.photos/seed/tshirt1/80/80'
                        }
                    ],
                    address: {
                        fullName: 'John Doe',
                        phone: '+91 9876543210',
                        address: '123 Main Street',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        pincode: '400001',
                        country: 'India'
                    },
                    delivery: 'express',
                    payment: 'upi',
                    subtotal: 899,
                    shipping: 150,
                    tax: 162,
                    discount: 0,
                    total: 1211,
                    status: 'shipped',
                    orderDate: new Date('2024-01-12').toISOString(),
                    estimatedDelivery: new Date('2024-01-15').toISOString()
                }
            ];
            this.saveOrders();
        }
        this.filteredOrders = [...this.orders];
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    setupEventListeners() {
        // Filter orders
        document.getElementById('orderFilter').addEventListener('change', (e) => {
            this.filterOrders(e.target.value);
        });

        // Search orders
        document.getElementById('orderSearch').addEventListener('input', (e) => {
            this.searchOrders(e.target.value);
        });
    }

    filterOrders(status) {
        if (status === 'all') {
            this.filteredOrders = [...this.orders];
        } else {
            this.filteredOrders = this.orders.filter(order => order.status === status);
        }
        this.renderOrders();
    }

    searchOrders(query) {
        if (!query) {
            this.filteredOrders = [...this.orders];
        } else {
            this.filteredOrders = this.orders.filter(order => 
                order.id.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.renderOrders();
    }

    renderOrders() {
        const ordersList = document.getElementById('ordersList');
        const emptyOrders = document.getElementById('emptyOrders');

        if (this.filteredOrders.length === 0) {
            ordersList.style.display = 'none';
            emptyOrders.style.display = 'block';
            return;
        }

        ordersList.style.display = 'grid';
        emptyOrders.style.display = 'none';

        ordersList.innerHTML = this.filteredOrders.map(order => this.createOrderCard(order)).join('');
    }

    createOrderCard(order) {
        const statusClass = `status-${order.status}`;
        const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);

        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <div class="order-id">${order.id}</div>
                        <div class="order-date">Placed on ${new Date(order.orderDate).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div class="order-status ${statusClass}">${statusText}</div>
                </div>
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="order-item-image">
                            <div class="order-item-info">
                                <div class="order-item-name">${item.name}</div>
                                <div class="order-item-details">
                                    <span class="order-item-price">₹${item.price.toLocaleString('en-IN')}</span>
                                    <span class="order-item-quantity">Qty: ${item.quantity}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-totals">
                    <div class="order-total">₹${order.total.toLocaleString('en-IN')}</div>
                    <div class="order-actions">
                        <button class="view-details-btn" onclick="viewOrderDetails('${order.id}')">
                            View Details
                        </button>
                        ${order.status !== 'cancelled' && order.status !== 'delivered' ? 
                            `<button class="track-order-btn" onclick="trackOrder('${order.id}')">
                                Track Order
                            </button>` : ''
                        }
                    </div>
                </div>
            </div>
        `;
    }

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('orderModal');
        const orderDetails = document.getElementById('orderDetails');

        orderDetails.innerHTML = `
            <div class="detail-section">
                <h4>Order Information</h4>
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value">${order.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Date:</span>
                    <span class="detail-value">${new Date(order.orderDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="order-status status-${order.status}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estimated Delivery:</span>
                    <span class="detail-value">${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</span>
                </div>
            </div>

            <div class="detail-section">
                <h4>Delivery Address</h4>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${order.address.fullName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${order.address.phone}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">${order.address.address}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">City:</span>
                    <span class="detail-value">${order.address.city}, ${order.address.state}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">PIN Code:</span>
                    <span class="detail-value">${order.address.pincode}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Country:</span>
                    <span class="detail-value">${order.address.country}</span>
                </div>
            </div>

            <div class="detail-section">
                <h4>Order Items</h4>
                ${order.items.map(item => `
                    <div class="detail-row">
                        <span class="detail-label">${item.name} (Qty: ${item.quantity})</span>
                        <span class="detail-value">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                `).join('')}
            </div>

            <div class="detail-section">
                <h4>Payment Information</h4>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">${this.getPaymentMethodName(order.payment)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Delivery Type:</span>
                    <span class="detail-value">${this.getDeliveryMethodName(order.delivery)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h4>Order Summary</h4>
                <div class="detail-row">
                    <span class="detail-label">Subtotal:</span>
                    <span class="detail-value">₹${order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Shipping:</span>
                    <span class="detail-value">₹${order.shipping.toLocaleString('en-IN')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tax:</span>
                    <span class="detail-value">₹${order.tax.toLocaleString('en-IN')}</span>
                </div>
                ${order.discount > 0 ? `
                    <div class="detail-row">
                        <span class="detail-label">Discount:</span>
                        <span class="detail-value" style="color: #27ae60;">-₹${order.discount.toLocaleString('en-IN')}</span>
                    </div>
                ` : ''}
                <div class="detail-row" style="font-weight: 700; font-size: 1.2rem; border-top: 2px solid #e9ecef; padding-top: 1rem;">
                    <span class="detail-label">Total:</span>
                    <span class="detail-value">₹${order.total.toLocaleString('en-IN')}</span>
                </div>
            </div>

            ${order.status !== 'cancelled' && order.status !== 'delivered' ? `
                <div class="detail-section">
                    <h4>Tracking Information</h4>
                    <div class="tracking-info">
                        <h5>Order Status</h5>
                        <div class="tracking-steps">
                            ${this.getTrackingSteps(order.status)}
                        </div>
                    </div>
                </div>
            ` : ''}
        `;

        modal.style.display = 'flex';
    }

    getPaymentMethodName(method) {
        const methods = {
            card: 'Credit/Debit Card',
            upi: 'UPI',
            netbanking: 'Net Banking',
            wallet: 'Wallet',
            cod: 'Cash on Delivery'
        };
        return methods[method] || method;
    }

    getDeliveryMethodName(delivery) {
        const methods = {
            standard: 'Standard Delivery (5-7 days)',
            express: 'Express Delivery (2-3 days)',
            overnight: 'Overnight Delivery (1 day)'
        };
        return methods[delivery] || delivery;
    }

    getTrackingSteps(status) {
        const steps = [
            { id: 'confirmed', label: 'Order Confirmed', icon: 'fa-check' },
            { id: 'processing', label: 'Processing', icon: 'fa-cog' },
            { id: 'shipped', label: 'Shipped', icon: 'fa-truck' },
            { id: 'delivered', label: 'Delivered', icon: 'fa-home' }
        ];

        const statusOrder = ['confirmed', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(status);

        return steps.map((step, index) => {
            let stepClass = '';
            if (index < currentIndex) {
                stepClass = 'completed';
            } else if (index === currentIndex) {
                stepClass = 'active';
            }

            return `
                <div class="tracking-step ${stepClass}">
                    <div class="step-icon">
                        <i class="fas ${step.icon}"></i>
                    </div>
                    <div class="step-label">${step.label}</div>
                </div>
            `;
        }).join('');
    }

    trackOrder(orderId) {
        // In a real application, this would open a tracking page
        this.showNotification(`Tracking order ${orderId}...`, 'info');
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
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.background = '#27ae60';
        } else if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else {
            notification.style.background = '#3498db';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global functions
function viewOrderDetails(orderId) {
    ordersManager.viewOrderDetails(orderId);
}

function trackOrder(orderId) {
    ordersManager.trackOrder(orderId);
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Initialize orders manager when DOM is ready
let ordersManager;
document.addEventListener('DOMContentLoaded', () => {
    ordersManager = new OrdersManager();
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
