// Payment System
class PaymentSystem {
    constructor() {
        this.cart = [];
        this.deliveryAddresses = [];
        this.selectedAddress = null;
        this.selectedDelivery = 'standard';
        this.selectedPayment = 'card';
        this.deliveryCharges = {
            standard: 50,
            express: 150,
            overnight: 250
        };
        this.init();
    }

    init() {
        this.loadCart();
        this.loadAddresses();
        this.setupEventListeners();
        this.renderCartItems();
        this.renderAddresses();
        this.calculateTotals();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    loadAddresses() {
        const savedAddresses = localStorage.getItem('deliveryAddresses');
        if (savedAddresses) {
            this.deliveryAddresses = JSON.parse(savedAddresses);
        } else {
            // Add default address for demo
            this.deliveryAddresses = [
                {
                    id: 1,
                    fullName: 'John Doe',
                    phone: '+91 9876543210',
                    address: '123 Main Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                    country: 'India',
                    isDefault: true
                }
            ];
        }
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processOrder();
        });

        // Address type toggle
        document.querySelectorAll('input[name="addressType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.toggleAddressForm(e.target.value);
            });
        });

        // Payment method toggle
        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePaymentForm(e.target.value);
            });
        });

        // Delivery option change
        document.querySelectorAll('input[name="delivery"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedDelivery = e.target.value;
                this.calculateTotals();
            });
        });

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Card expiry formatting
        const cardExpiryInput = document.getElementById('cardExpiry');
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
            });
        }

        // CVV validation
        const cardCVVInput = document.getElementById('cardCVV');
        if (cardCVVInput) {
            cardCVVInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        // PIN code validation
        const pincodeInput = document.getElementById('pincode');
        if (pincodeInput) {
            pincodeInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        // Phone number validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
            });
        }
    }

    toggleAddressForm(type) {
        const existingForm = document.getElementById('existingAddresses');
        const newForm = document.getElementById('newAddressForm');

        if (type === 'existing') {
            existingForm.style.display = 'block';
            newForm.style.display = 'none';
        } else {
            existingForm.style.display = 'none';
            newForm.style.display = 'block';
        }
    }

    togglePaymentForm(method) {
        // Hide all payment forms
        document.querySelectorAll('.payment-form').forEach(form => {
            form.style.display = 'none';
        });

        // Show selected payment form
        const selectedForm = document.getElementById(`${method}Payment`);
        if (selectedForm) {
            selectedForm.style.display = 'block';
        }

        this.selectedPayment = method;
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image || 'https://picsum.photos/seed/product' + item.id + '/80/80'}" 
                     alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-details">
                        <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>
                        <span class="cart-item-quantity">Qty: ${item.quantity}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderAddresses() {
        const existingAddressesContainer = document.getElementById('existingAddresses');
        if (!existingAddressesContainer) return;

        if (this.deliveryAddresses.length === 0) {
            existingAddressesContainer.innerHTML = '<p>No saved addresses found</p>';
            return;
        }

        existingAddressesContainer.innerHTML = this.deliveryAddresses.map(address => `
            <div class="address-card ${address.isDefault ? 'selected' : ''}" data-id="${address.id}">
                <h4>${address.fullName}</h4>
                <p>${address.address}</p>
                <p>${address.city}, ${address.state} - ${address.pincode}</p>
                <p>${address.country}</p>
                <p>📞 ${address.phone}</p>
                ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
            </div>
        `).join('');

        // Add click handlers for address selection
        document.querySelectorAll('.address-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedAddress = this.deliveryAddresses.find(a => a.id == card.dataset.id);
            });
        });
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = this.deliveryCharges[this.selectedDelivery] || 0;
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const discount = this.calculateDiscount();
        const total = subtotal + shipping + tax - discount;

        // Update DOM
        document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        document.getElementById('shipping').textContent = `₹${shipping.toLocaleString('en-IN')}`;
        document.getElementById('tax').textContent = `₹${tax.toLocaleString('en-IN')}`;
        document.getElementById('discount').textContent = `-₹${discount.toLocaleString('en-IN')}`;
        document.getElementById('finalTotal').textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    calculateDiscount() {
        // Simple discount logic - 10% off for orders above ₹5000
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        return subtotal > 5000 ? Math.round(subtotal * 0.1) : 0;
    }

    validateForm() {
        let isValid = true;
        const errors = [];

        // Check if cart is empty
        if (this.cart.length === 0) {
            errors.push('Your cart is empty');
            isValid = false;
        }

        // Check address selection
        const addressType = document.querySelector('input[name="addressType"]:checked').value;
        if (addressType === 'existing' && !this.selectedAddress) {
            errors.push('Please select a delivery address');
            isValid = false;
        } else if (addressType === 'new') {
            const requiredFields = ['fullName', 'phone', 'address', 'city', 'state', 'pincode'];
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!input || !input.value.trim()) {
                    errors.push(`Please fill in all required address fields`);
                    isValid = false;
                }
            });
        }

        // Check payment method
        if (this.selectedPayment === 'card') {
            const cardFields = ['cardNumber', 'cardName', 'cardExpiry', 'cardCVV'];
            cardFields.forEach(field => {
                const input = document.getElementById(field);
                if (!input || !input.value.trim()) {
                    errors.push(`Please fill in all card details`);
                    isValid = false;
                }
            });
        } else if (this.selectedPayment === 'upi') {
            const upiInput = document.getElementById('upiId');
            if (!upiInput || !upiInput.value.trim()) {
                errors.push('Please enter your UPI ID');
                isValid = false;
            }
        } else if (this.selectedPayment === 'netbanking') {
            const bankSelect = document.getElementById('bankSelect');
            if (!bankSelect || !bankSelect.value) {
                errors.push('Please select your bank');
                isValid = false;
            }
        } else if (this.selectedPayment === 'wallet') {
            const walletSelect = document.getElementById('walletSelect');
            if (!walletSelect || !walletSelect.value) {
                errors.push('Please select your wallet');
                isValid = false;
            }
        }

        // Check terms acceptance
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox || !termsCheckbox.checked) {
            errors.push('Please accept the terms and conditions');
            isValid = false;
        }

        if (!isValid) {
            this.showErrors(errors);
        }

        return isValid;
    }

    showErrors(errors) {
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = error;
            errorElement.style.color = '#e74c3c';
            errorElement.style.marginBottom = '1rem';
            errorElement.style.padding = '0.5rem';
            errorElement.style.background = '#fdf2f2';
            errorElement.style.border = '1px solid #fecaca';
            errorElement.style.borderRadius = '5px';
            
            document.querySelector('.checkout-form').insertBefore(errorElement, document.querySelector('.form-section'));
        });
    }

    async processOrder() {
        if (!this.validateForm()) {
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('.place-order-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        try {
            // Simulate payment processing
            await this.simulatePayment();

            // Create order
            const order = this.createOrder();

            // Save order
            this.saveOrder(order);

            // Clear cart
            localStorage.removeItem('cart');

            // Save new address if requested
            if (document.getElementById('saveAddress')?.checked) {
                this.saveNewAddress();
            }

            // Show success modal
            this.showSuccessModal(order);

        } catch (error) {
            console.error('Order processing failed:', error);
            this.showNotification('Order processing failed. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulatePayment() {
        // Simulate payment processing delay
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    createOrder() {
        const orderId = 'BF' + Date.now();
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = this.deliveryCharges[this.selectedDelivery] || 0;
        const tax = Math.round(subtotal * 0.18);
        const discount = this.calculateDiscount();
        const total = subtotal + shipping + tax - discount;

        let address = this.selectedAddress;
        if (!address) {
            address = {
                fullName: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                pincode: document.getElementById('pincode').value,
                country: document.getElementById('country').value
            };
        }

        return {
            id: orderId,
            items: this.cart,
            address: address,
            delivery: this.selectedDelivery,
            payment: this.selectedPayment,
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            discount: discount,
            total: total,
            status: 'confirmed',
            orderDate: new Date().toISOString(),
            estimatedDelivery: this.calculateDeliveryDate()
        };
    }

    calculateDeliveryDate() {
        const deliveryTimes = {
            standard: 7,
            express: 3,
            overnight: 1
        };
        
        const days = deliveryTimes[this.selectedDelivery] || 7;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days);
        
        return deliveryDate.toISOString().split('T')[0];
    }

    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    saveNewAddress() {
        const newAddress = {
            id: Date.now(),
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            pincode: document.getElementById('pincode').value,
            country: document.getElementById('country').value,
            isDefault: false
        };

        this.deliveryAddresses.push(newAddress);
        localStorage.setItem('deliveryAddresses', JSON.stringify(this.deliveryAddresses));
    }

    showSuccessModal(order) {
        const modal = document.getElementById('successModal');
        const orderIdElement = document.getElementById('orderId');
        const deliveryDateElement = document.getElementById('deliveryDate');

        orderIdElement.textContent = order.id;
        deliveryDateElement.textContent = new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        modal.style.display = 'flex';
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

// Global functions for modal actions
function viewOrderDetails() {
    // Redirect to orders page or show order details
    window.location.href = 'index.html#orders';
}

function continueShopping() {
    window.location.href = 'index.html';
}

// Initialize payment system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PaymentSystem();
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
