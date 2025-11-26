// auth.js - Shared authentication functions

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Get current user data
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Login function
function loginUser(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
    updateUIForLoggedInUser();
}

// Logout function
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    updateUIForLoggedOutUser();
}

// Update UI when user is logged in
function updateUIForLoggedInUser() {
    const userDropdown = document.getElementById('userDropdown');
    const userName = document.getElementById('userName');
    const authSection = document.getElementById('authSection');
    const userInfoSection = document.getElementById('userInfoSection');
    
    const user = getCurrentUser();
    
    if (userDropdown) userDropdown.style.display = 'block';
    if (userName) userName.textContent = user?.firstName || 'User';
    if (authSection) authSection.style.display = 'none';
    if (userInfoSection) {
        userInfoSection.style.display = 'block';
        const welcomeUserName = document.getElementById('welcomeUserName');
        if (welcomeUserName) {
            welcomeUserName.textContent = `Welcome, ${user?.firstName || 'User'}!`;
        }
    }
}

// Update UI when user is logged out
function updateUIForLoggedOutUser() {
    const userDropdown = document.getElementById('userDropdown');
    const authSection = document.getElementById('authSection');
    const userInfoSection = document.getElementById('userInfoSection');
    
    if (userDropdown) userDropdown.style.display = 'none';
    if (authSection) authSection.style.display = 'block';
    if (userInfoSection) userInfoSection.style.display = 'none';
}

// Initialize authentication state on page load
function initializeAuth() {
    if (isUserLoggedIn()) {
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }
}

// Show toast notifications
function showToast(message, type = 'success') {
    const bgClass = type === 'success' ? 'bg-success' : 
                    type === 'danger' ? 'bg-danger' : 
                    type === 'warning' ? 'bg-warning' :
                    type === 'info' ? 'bg-info' : 'bg-success';
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white ${bgClass} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.id = toastId;
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    const toastContainer = document.getElementById('toastContainer') || document.body;
    toastContainer.appendChild(toast);
    
    const bsToast = typeof bootstrap !== 'undefined' ? new bootstrap.Toast(toast) : null;
    if (bsToast) {
        bsToast.show();
    }
    
    toast.addEventListener('hidden.bs.toast', () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
    
    // Auto remove after 5 seconds if Bootstrap not available
    if (!bsToast) {
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }
}