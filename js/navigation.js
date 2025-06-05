// Navigation functionality for From Vanilla to React website

// Initialize navigation when called from main.js
function initializeNavigation() {
    setupMobileNavigation();
    setupDropdownNavigation();
    setupActiveNavigation();
    console.log('Navigation initialized');
}

// Mobile navigation toggle functionality
function setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Only close if it's not a dropdown trigger
            if (!link.parentElement.classList.contains('dropdown')) {
                closeMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    function openMobileMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus management
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            firstLink.focus();
        }
    }
    
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = ''; // Restore scrolling
        
        // Return focus to toggle button
        navToggle.focus();
    }
}

// Desktop dropdown navigation
function setupDropdownNavigation() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        let timeoutId;
        
        if (!trigger || !menu) return;
        
        // Mouse events for desktop
        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(timeoutId);
            showDropdown(trigger, menu);
        });
        
        dropdown.addEventListener('mouseleave', function() {
            timeoutId = setTimeout(() => {
                hideDropdown(trigger, menu);
            }, 150); // Small delay to prevent flickering
        });
        
        // Keyboard navigation
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                showDropdown(trigger, menu);
                const firstItem = menu.querySelector('a');
                if (firstItem) firstItem.focus();
            }
        });
        
        // Handle dropdown menu item navigation
        const menuItems = menu.querySelectorAll('a');
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', function(e) {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextItem = menuItems[index + 1];
                        if (nextItem) nextItem.focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevItem = menuItems[index - 1];
                        if (prevItem) {
                            prevItem.focus();
                        } else {
                            trigger.focus();
                            hideDropdown(trigger, menu);
                        }
                        break;
                    case 'Escape':
                        trigger.focus();
                        hideDropdown(trigger, menu);
                        break;
                    case 'Tab':
                        if (!e.shiftKey && index === menuItems.length - 1) {
                            hideDropdown(trigger, menu);
                        }
                        break;
                }
            });
        });
    });
    
    function showDropdown(trigger, menu) {
        trigger.setAttribute('aria-expanded', 'true');
        menu.classList.add('show');
    }
    
    function hideDropdown(trigger, menu) {
        trigger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('show');
    }
}

// Set active navigation state based on current page
function setupActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Add active class to current page link
        if (linkPath === currentPath || 
            (currentPath === '/' && link.getAttribute('href') === '#home')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Breadcrumb navigation (for content pages)
function setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.breadcrumbs');
    if (!breadcrumbContainer) return;
    
    const pathParts = window.location.pathname.split('/').filter(part => part);
    const breadcrumbs = [
        { name: 'Home', url: '/' }
    ];
    
    // Build breadcrumb trail based on URL structure
    let currentPath = '';
    pathParts.forEach((part, index) => {
        currentPath += '/' + part;
        
        // Convert URL part to readable name
        const name = part.replace(/-/g, ' ')
                        .replace(/\.html$/, '')
                        .replace(/\b\w/g, l => l.toUpperCase());
        
        breadcrumbs.push({
            name: name,
            url: currentPath,
            isLast: index === pathParts.length - 1
        });
    });
    
    // Generate breadcrumb HTML
    const breadcrumbHTML = breadcrumbs.map(crumb => {
        if (crumb.isLast) {
            return `<span class="breadcrumb-current" aria-current="page">${crumb.name}</span>`;
        } else {
            return `<a href="${crumb.url}" class="breadcrumb-link">${crumb.name}</a>`;
        }
    }).join('<span class="breadcrumb-separator" aria-hidden="true">›</span>');
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Search functionality placeholder
function setupSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchToggle || !searchForm || !searchInput) return;
    
    searchToggle.addEventListener('click', function() {
        const isVisible = searchForm.classList.contains('active');
        
        if (isVisible) {
            searchForm.classList.remove('active');
            searchToggle.setAttribute('aria-expanded', 'false');
        } else {
            searchForm.classList.add('active');
            searchToggle.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        }
    });
    
    // Close search on escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchForm.classList.remove('active');
            searchToggle.setAttribute('aria-expanded', 'false');
            searchToggle.focus();
        }
    });
    
    // Simple search implementation (placeholder)
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (query) {
            // This would typically redirect to a search results page
            // For now, we'll just show an alert
            alert(`Search functionality would search for: "${query}"`);
        }
    });
}

// Progress indicator for learning path
function updateProgressIndicator() {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (!progressBar || !progressText) return;
    
    // This would typically get progress from localStorage or a backend
    // For now, we'll calculate based on visited pages
    const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '[]');
    const totalPages = 12; // Approximate number of learning pages
    const progress = Math.min((visitedPages.length / totalPages) * 100, 100);
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}% Complete`;
    
    // Mark current page as visited
    const currentPage = window.location.pathname;
    if (!visitedPages.includes(currentPage)) {
        visitedPages.push(currentPage);
        localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
    }
}

// Initialize all navigation features
document.addEventListener('DOMContentLoaded', function() {
    setupBreadcrumbs();
    setupSearch();
    updateProgressIndicator();
});

// Export functions for use in other modules
window.Navigation = {
    setupActiveNavigation,
    setupBreadcrumbs,
    updateProgressIndicator
}; 