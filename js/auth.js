// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        // Check for existing session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser();
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // User button click
        document.getElementById('userBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.currentUser) {
                this.toggleUserDropdown();
            } else {
                this.showAuthModal();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeUserDropdown();
        });

        // Form submissions
        document.getElementById('signinForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignIn();
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignUp();
        });

        // Modal close on background click
        document.getElementById('authModal').addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.closeAuthModal();
            }
        });

        // Input validation
        this.setupInputValidation();
    }

    setupInputValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateEmail(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        // Password validation
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('blur', () => this.validatePassword(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        // Name validation
        const nameInput = document.getElementById('signupName');
        if (nameInput) {
            nameInput.addEventListener('blur', () => this.validateName(nameInput));
            nameInput.addEventListener('input', () => this.clearError(nameInput));
        }

        // Confirm password validation
        const confirmPassword = document.getElementById('signupConfirmPassword');
        if (confirmPassword) {
            confirmPassword.addEventListener('blur', () => this.validatePasswordMatch());
            confirmPassword.addEventListener('input', () => this.clearError(confirmPassword));
        }
    }

    validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorElement = document.getElementById(input.id + 'Error');
        
        if (!emailRegex.test(input.value)) {
            input.classList.add('error');
            if (errorElement) errorElement.classList.add('show');
            return false;
        }
        
        this.clearError(input);
        return true;
    }

    validatePassword(input) {
        const errorElement = document.getElementById(input.id + 'Error');
        const minLength = input.id.includes('signup') ? 6 : 1;
        
        if (input.value.length < minLength) {
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = input.id.includes('signup') 
                    ? 'Password must be at least 6 characters' 
                    : 'Password is required';
                errorElement.classList.add('show');
            }
            return false;
        }
        
        this.clearError(input);
        return true;
    }

    validateName(input) {
        const errorElement = document.getElementById(input.id + 'Error');
        
        if (input.value.trim().length < 2) {
            input.classList.add('error');
            if (errorElement) errorElement.classList.add('show');
            return false;
        }
        
        this.clearError(input);
        return true;
    }

    validatePasswordMatch() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const errorElement = document.getElementById('signupConfirmPasswordError');
        const input = document.getElementById('signupConfirmPassword');
        
        if (password !== confirmPassword) {
            input.classList.add('error');
            if (errorElement) errorElement.classList.add('show');
            return false;
        }
        
        this.clearError(input);
        return true;
    }

    clearError(input) {
        input.classList.remove('error');
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) errorElement.classList.remove('show');
    }

    handleSignIn() {
        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate inputs
        if (!this.validateEmail(document.getElementById('signinEmail')) ||
            !this.validatePassword(document.getElementById('signinPassword'))) {
            return;
        }

        // Check credentials
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            
            this.showSuccess('Sign In Successful', `Welcome back, ${user.name}!`);
            this.updateUIForLoggedInUser();
            
            setTimeout(() => {
                this.closeAuthModal();
            }, 2000);
        } else {
            this.showError('Invalid email or password');
        }
    }

    handleSignUp() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validate all inputs
        const isNameValid = this.validateName(document.getElementById('signupName'));
        const isEmailValid = this.validateEmail(document.getElementById('signupEmail'));
        const isPasswordValid = this.validatePassword(document.getElementById('signupPassword'));
        const isPasswordMatchValid = this.validatePasswordMatch();

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordMatchValid) {
            return;
        }

        if (!agreeTerms) {
            this.showError('Please agree to the Terms & Conditions');
            return;
        }

        // Check if user already exists
        if (this.users.find(u => u.email === email)) {
            this.showError('An account with this email already exists');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
            orders: [],
            wishlist: []
        };

        this.users.push(newUser);
        this.saveUsers();
        
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        this.showSuccess('Account Created Successfully', `Welcome to BizzareFashion, ${name}!`);
        this.updateUIForLoggedInUser();
        
        setTimeout(() => {
            this.closeAuthModal();
        }, 2000);
    }

    showSuccess(title, message) {
        const forms = document.querySelectorAll('.auth-form');
        const successDiv = document.getElementById('authSuccess');
        
        forms.forEach(form => form.style.display = 'none');
        successDiv.classList.add('show');
        
        document.getElementById('successTitle').textContent = title;
        document.getElementById('successMessage').textContent = message;
    }

    showError(message) {
        showNotification(message, 'error');
    }

    updateUIForLoggedInUser() {
        const userBtn = document.getElementById('userBtn');
        const userBtnText = document.getElementById('userBtnText');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');

        if (this.currentUser) {
            userBtnText.textContent = 'Account';
            userName.textContent = this.currentUser.name;
            userEmail.textContent = this.currentUser.email;
        } else {
            userBtnText.textContent = 'Sign In';
            userName.textContent = 'Guest User';
            userEmail.textContent = 'Not logged in';
        }
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('show');
    }

    closeUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.remove('show');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        this.updateUIForLoggedInUser();
        this.closeUserDropdown();
        
        showNotification('You have been signed out successfully');
        
        // Clear cart and wishlist
        cart = [];
        wishlist = [];
        updateCartCount();
        loadProducts();
    }

    showAuthModal() {
        document.getElementById('authModal').classList.add('active');
        this.resetForms();
    }

    closeAuthModal() {
        document.getElementById('authModal').classList.remove('active');
        this.resetForms();
    }

    resetForms() {
        const forms = document.querySelectorAll('.auth-form');
        const successDiv = document.getElementById('authSuccess');
        
        forms.forEach(form => {
            form.reset();
            form.style.display = form.id === 'signinForm' ? 'block' : 'none';
        });
        
        successDiv.classList.remove('show');
        
        // Reset tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector('.auth-tab').classList.add('active');
        
        // Clear all errors
        document.querySelectorAll('.error').forEach(input => {
            input.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
    }

    loadUsers() {
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
        
        // Default demo users
        return [
            {
                id: 1,
                name: 'Demo User',
                email: 'demo@bizzarefashion.com',
                password: 'demo123',
                createdAt: new Date().toISOString(),
                orders: [],
                wishlist: []
            }
        ];
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
}

// Global functions for HTML onclick handlers
function switchAuthTab(tab) {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'signin') {
        signinForm.style.display = 'block';
        signupForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        signinForm.style.display = 'none';
        signupForm.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

function closeAuthModal() {
    authSystem.closeAuthModal();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showForgotPassword() {
    showNotification('Password reset functionality would be implemented here');
}

function socialSignIn(provider) {
    showNotification(`${provider} sign-in would be implemented here`);
}

function socialSignUp(provider) {
    showNotification(`${provider} sign-up would be implemented here`);
}

// User dropdown functions
function showProfile() {
    showNotification('Profile page would be displayed here');
    authSystem.closeUserDropdown();
}

function showOrders() {
    showNotification('Orders page would be displayed here');
    authSystem.closeUserDropdown();
}

function showWishlist() {
    showNotification('Wishlist page would be displayed here');
    authSystem.closeUserDropdown();
}

function showSettings() {
    showNotification('Settings page would be displayed here');
    authSystem.closeUserDropdown();
}

function logout() {
    authSystem.logout();
}

// Initialize auth system
const authSystem = new AuthSystem();
