// auth-utils.js - Shared authentication utilities

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Get current user data
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Update UI based on login status
function updateLoginStatus() {
    const userDropdown = document.getElementById('userDropdown');
    const userName = document.getElementById('userName');
    const loginLink = document.querySelector('a[href="login.html"]');
    
    if (isUserLoggedIn() && getCurrentUser()) {
        const user = getCurrentUser();
        if (userDropdown) {
            userDropdown.style.display = 'block';
        }
        if (userName) {
            userName.textContent = user.firstName || user.name || 'User';
        }
        if (loginLink) {
            loginLink.style.display = 'none';
        }
    } else {
        if (userDropdown) {
            userDropdown.style.display = 'none';
        }
        if (loginLink) {
            loginLink.style.display = 'block';
        }
    }
}

// Login function
function login(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
    updateLoginStatus();
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    updateLoginStatus();
    window.location.href = 'login.html';
}

// Show custom alert
function showCustomAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 1100; min-width: 300px;';
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// Initialize auth on page load
function initializeAuth() {
    updateLoginStatus();
    
    // Add logout event listener if logout button exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Cart functionality
function initializeCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const dropdownCart = document.getElementById('dropdownCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    function saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function openCart() {
        if (cartSidebar) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeCartSidebar() {
        if (cartSidebar) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    if (cartToggle) {
        cartToggle.addEventListener('click', openCart);
    }
    
    if (dropdownCart) {
        dropdownCart.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
    
    function updateCartDisplay() {
        if (!cartCount) return;
        
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCount.textContent = totalItems;
        
        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                if (checkoutBtn) checkoutBtn.disabled = true;
            } else {
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    const cartItemElement = document.createElement('div');
                    cartItemElement.className = 'cart-item';
                    cartItemElement.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex">
                                <img src="${item.image}" class="cart-item-img me-3" alt="${item.name}">
                                <div>
                                    <h6 class="mb-1">${item.name}</h6>
                                    <p class="mb-1 text-muted">$${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <div class="input-group quantity-control">
                                <button class="btn btn-outline-secondary decrease-qty" data-id="${item.id}">-</button>
                                <input type="text" class="form-control text-center item-qty" value="${item.quantity}" data-id="${item.id}">
                                <button class="btn btn-outline-secondary increase-qty" data-id="${item.id}">+</button>
                            </div>
                            <span class="fw-bold">$${itemTotal.toFixed(2)}</span>
                        </div>
                    `;
                    cartItems.appendChild(cartItemElement);
                });
                
                if (checkoutBtn) checkoutBtn.disabled = false;
            }
        }
        
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        const shipping = subtotal > 0 ? 15.00 : 0;
        const total = subtotal + shipping;
        
        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartShipping) cartShipping.textContent = `$${shipping.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Event delegation for cart item actions
    document.addEventListener('click', (e) => {
        if (e.target.closest('.remove-item')) {
            const itemId = e.target.closest('.remove-item').getAttribute('data-id');
            cart = cart.filter(item => item.id !== itemId);
            saveCartToStorage();
            updateCartDisplay();
        }
        
        if (e.target.closest('.increase-qty')) {
            const itemId = e.target.closest('.increase-qty').getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            if (item) {
                item.quantity += 1;
                saveCartToStorage();
                updateCartDisplay();
            }
        }
        
        if (e.target.closest('.decrease-qty')) {
            const itemId = e.target.closest('.decrease-qty').getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                saveCartToStorage();
                updateCartDisplay();
            }
        }
    });
    
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('item-qty')) {
            const itemId = e.target.getAttribute('data-id');
            const newQuantity = parseInt(e.target.value);
            const item = cart.find(item => item.id === itemId);
            
            if (item && newQuantity > 0) {
                item.quantity = newQuantity;
                saveCartToStorage();
                updateCartDisplay();
            } else if (item && newQuantity <= 0) {
                cart = cart.filter(item => item.id !== itemId);
                saveCartToStorage();
                updateCartDisplay();
            }
        }
    });
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('cartTotal', document.getElementById('cartTotal').textContent);
            window.location.href = 'checkout.html';
        });
    }
    
    updateCartDisplay();
}

// Initialize everything
function initializeAll() {
    initializeAuth();
    initializeCart();
}