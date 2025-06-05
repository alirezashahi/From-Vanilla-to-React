// Main JavaScript file for From Vanilla to React website

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize theme system
    initializeTheme();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize accessibility features
    initializeAccessibility();
    
    console.log('From Vanilla to React website initialized');
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    // Select all anchor links that start with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations and intersection observer
function initializeAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    const animatedElements = document.querySelectorAll('.benefit-card, .section-card, .step');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize accessibility features
function initializeAccessibility() {
    // Add skip link functionality
    addSkipLink();
    
    // Improve keyboard navigation
    improveKeyboardNavigation();
    
    // Add ARIA labels and descriptions where needed
    addARIALabels();
}

// Add skip link for accessibility
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    
    // Add ID to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Improve keyboard navigation
function improveKeyboardNavigation() {
    // Add keyboard support for dropdown menus
    const dropdownItems = document.querySelectorAll('.dropdown');
    
    dropdownItems.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (trigger && menu) {
            trigger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                    
                    // Focus first menu item
                    const firstMenuItem = menu.querySelector('a');
                    if (firstMenuItem) {
                        firstMenuItem.focus();
                    }
                }
            });
            
            // Hide menu on escape
            menu.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                    trigger.focus();
                }
            });
        }
    });
}

// Add ARIA labels and descriptions
function addARIALabels() {
    // Add aria-expanded to dropdown triggers
    const dropdownTriggers = document.querySelectorAll('.dropdown .nav-link');
    dropdownTriggers.forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
    });
    
    // Add aria-label to external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        const currentLabel = link.getAttribute('aria-label') || '';
        link.setAttribute('aria-label', currentLabel + ' (opens in new tab)');
    });
}

// Utility function to debounce function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function to throttle function calls
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle window resize events
const handleResize = debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768) {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
}, 250);

window.addEventListener('resize', handleResize);

// Handle scroll events for header behavior
const handleScroll = throttle(() => {
    const header = document.querySelector('.main-header');
    const scrollPosition = window.scrollY;
    
    // Add shadow to header when scrolled
    if (scrollPosition > 10) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'none';
    }
}, 100);

window.addEventListener('scroll', handleScroll);

// Error handling for images
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create a placeholder div if image fails to load
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = `
                width: 100%;
                height: 200px;
                background: var(--color-bg-tertiary);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--color-text-muted);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-md);
            `;
            placeholder.textContent = 'Image not available';
            
            this.parentNode.replaceChild(placeholder, this);
        });
    });
}

// Initialize image error handling
document.addEventListener('DOMContentLoaded', handleImageErrors);

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }
}

// Initialize performance monitoring
monitorPerformance();

// Export functions for use in other modules
window.AppUtils = {
    debounce,
    throttle,
    addARIALabels,
    handleImageErrors
}; 