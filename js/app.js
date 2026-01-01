// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initModals();
    loadFeatures();
    loadBooks();
    loadAIFeatures();
    
    // Add smooth scrolling for anchor links
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
});

// Navigation functionality
function initNavigation() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
}

// Modal functionality
function initModals() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Login modal
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'block';
        });
    }
    
    // Signup modal
    if (signupBtn && signupModal) {
        signupBtn.addEventListener('click', function() {
            signupModal.style.display = 'block';
        });
    }
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
}

// Load features dynamically
function loadFeatures() {
    const features = [
        {
            icon: 'fas fa-robot',
            title: 'AI-Powered Search',
            description: 'Our intelligent search understands context and meaning, not just keywords, to deliver more relevant results.'
        },
        {
            icon: 'fas fa-book',
            title: 'Vast Digital Collection',
            description: 'Access thousands of e-books, academic papers, and research materials from various disciplines.'
        },
        {
            icon: 'fas fa-user-friends',
            title: 'Personalized Recommendations',
            description: 'Get book suggestions tailored to your interests, reading history, and academic needs.'
        }
    ];
    
    const featuresGrid = document.getElementById('featuresGrid');
    
    if (featuresGrid) {
        featuresGrid.innerHTML = features.map(feature => `
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }
}

// Load AI features dynamically
function loadAIFeatures() {
    const aiFeatures = [
        {
            icon: 'fas fa-search',
            title: 'Semantic Search',
            description: 'Find resources based on meaning and concepts, not just matching keywords. Our AI understands what you\'re really looking for.'
        },
        {
            icon: 'fas fa-lightbulb',
            title: 'Content Summarization',
            description: 'Get concise summaries of long documents and books to quickly understand key concepts and decide what to read.'
        },
        {
            icon: 'fas fa-project-diagram',
            title: 'Knowledge Graph',
            description: 'Explore interconnected concepts and discover related materials through our visual knowledge mapping system.'
        }
    ];
    
    const aiFeaturesGrid = document.getElementById('aiFeaturesGrid');
    
    if (aiFeaturesGrid) {
        aiFeaturesGrid.innerHTML = aiFeatures.map(feature => `
            <div class="ai-feature-card">
                <h3><i class="${feature.icon}"></i> ${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }
}

// Handle login
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // In a real application, this would be an API call
    console.log('Login attempt:', { email, password });
    
    // Simulate API call
    setTimeout(() => {
        alert('Login successful! Welcome back to SmartLib.');
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('loginForm').reset();
        
        // Update UI to show user is logged in
        updateAuthUI(true);
    }, 1000);
}

// Handle signup
function handleSignup() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // In a real application, this would be an API call
    console.log('Signup attempt:', { fullName, email, password });
    
    // Simulate API call
    setTimeout(() => {
        alert('Account created successfully! Welcome to SmartLib.');
        document.getElementById('signupModal').style.display = 'none';
        document.getElementById('signupForm').reset();
        
        // Update UI to show user is logged in
        updateAuthUI(true);
    }, 1000);
}

// Update UI after authentication
function updateAuthUI(isLoggedIn) {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-outline" id="userBtn">
                    <i class="fas fa-user"></i> My Account
                </button>
            </div>
        `;
    }
}

// Utility function for API calls
async function apiCall(endpoint, options = {}) {
    const baseURL = 'http://localhost:3000/api'; // Change this to your backend URL
    
    try {
        const response = await fetch(`${baseURL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}