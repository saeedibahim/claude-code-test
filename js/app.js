// ===========================
// Authentication & App Logic
// ===========================

// Check if user is already logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;

    // Redirect to dashboard if logged in and on login page
    if (isLoggedIn === 'true' && currentPage.endsWith('index.html')) {
        window.location.href = 'dashboard.html';
    }

    // Redirect to login if not logged in and trying to access dashboard
    if (isLoggedIn !== 'true' && currentPage.endsWith('dashboard.html')) {
        window.location.href = 'index.html';
    }

    // Initialize login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        initLoginForm();
    }

    // Initialize logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        initLogoutButton();
    }

    // Initialize dashboard features
    if (currentPage.endsWith('dashboard.html')) {
        initDashboard();
    }
});

// ===========================
// Login Form Handler
// ===========================

function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        // Simulate login process
        performLogin(email, password);
    });

    // Add input animations
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// ===========================
// Login Logic
// ===========================

function performLogin(email, password) {
    // Show loading state
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Signing in...</span>';
    submitBtn.disabled = true;

    // Simulate API call with setTimeout
    setTimeout(() => {
        // For demo purposes, accept any email/password
        // In production, this would be an actual API call

        // Store user data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', getUserNameFromEmail(email));

        // Show success notification
        showNotification('Login successful! Redirecting...', 'success');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    }, 1500);
}

// ===========================
// Logout Handler
// ===========================

function initLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        performLogout();
    });
}

function performLogout() {
    // Clear user data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

    // Show notification
    showNotification('Logged out successfully', 'success');

    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// ===========================
// Dashboard Initialization
// ===========================

function initDashboard() {
    // Update user name in header
    const userName = localStorage.getItem('userName') || 'User';
    const headerTitle = document.querySelector('.header-left h1');
    if (headerTitle) {
        headerTitle.textContent = `Welcome back, ${userName}!`;
    }

    // Update user profile
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = userName;
    });

    // Add interactivity to cards
    initCardInteractions();

    // Add smooth scroll animations
    initScrollAnimations();

    // Update real-time stats
    updateStats();
}

// ===========================
// Card Interactions
// ===========================

function initCardInteractions() {
    // Add click handlers for project items
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const projectName = this.querySelector('h4').textContent;
            showNotification(`Opening ${projectName}...`, 'info');
        });
    });

    // Add click handlers for team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.style.cursor = 'pointer';
        member.addEventListener('click', function() {
            const memberName = this.querySelector('h4').textContent;
            showNotification(`Opening profile for ${memberName}...`, 'info');
        });
    });

    // Add click handlers for repo items
    const repoItems = document.querySelectorAll('.repo-item');
    repoItems.forEach(repo => {
        repo.style.cursor = 'pointer';
        repo.addEventListener('click', function() {
            const repoName = this.querySelector('h4').textContent;
            showNotification(`Opening repository ${repoName}...`, 'info');
        });
    });

    // Add navigation item highlighting
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            const sectionName = this.querySelector('span').textContent;
            showNotification(`Navigating to ${sectionName}...`, 'info');
        });
    });
}

// ===========================
// Scroll Animations
// ===========================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.stat-card, .card, .project-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ===========================
// Update Stats (Simulated)
// ===========================

function updateStats() {
    // Simulate real-time stat updates
    setInterval(() => {
        const commitStat = document.querySelector('.stat-card:last-child .stat-value');
        if (commitStat) {
            const currentValue = parseInt(commitStat.textContent);
            const shouldUpdate = Math.random() > 0.7; // 30% chance of update

            if (shouldUpdate) {
                commitStat.textContent = currentValue + Math.floor(Math.random() * 3) + 1;

                // Add pulse animation
                commitStat.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    commitStat.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }, 10000); // Update every 10 seconds
}

// ===========================
// Notification System
// ===========================

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        fontSize: '0.875rem',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease-out',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        maxWidth: '400px'
    });

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1',
        warning: '#f59e0b'
    };
    notification.style.background = colors[type] || colors.info;

    // Add to page
    document.body.appendChild(notification);

    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===========================
// Utility Functions
// ===========================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getUserNameFromEmail(email) {
    // Extract name from email (before @)
    const name = email.split('@')[0];

    // Capitalize first letter of each word
    return name
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ===========================
// Social Login Handlers
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const socialButtons = document.querySelectorAll('.btn-social');

    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.textContent.trim();
            showNotification(`${provider} login is not yet configured`, 'info');
        });
    });

    // Handle "New Project" button
    const newProjectBtn = document.querySelector('.header-right .btn-primary');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function() {
            showNotification('Opening new project dialog...', 'info');
        });
    }

    // Handle notification button
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotification('You have 3 new notifications', 'info');
        });
    }
});

// ===========================
// Progress Bar Animation
// ===========================

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Animate progress bars when dashboard loads
if (window.location.pathname.endsWith('dashboard.html')) {
    setTimeout(animateProgressBars, 500);
}

// ===========================
// Keyboard Shortcuts
// ===========================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for quick search (placeholder)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showNotification('Search feature coming soon!', 'info');
    }

    // Ctrl/Cmd + N for new project
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (window.location.pathname.endsWith('dashboard.html')) {
            showNotification('Opening new project dialog...', 'info');
        }
    }
});

console.log('%c DevSpace %c Developer Workspace v1.0 ',
    'background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 5px 10px; border-radius: 3px 0 0 3px;',
    'background: #1a1d26; color: #9ca3af; padding: 5px 10px; border-radius: 0 3px 3px 0;'
);
