// Theme management for From Vanilla to React website

// Initialize theme system when called from main.js
function initializeTheme() {
    loadThemeFromStorage();
    setupThemeToggle();
    handleSystemThemeChange();
    console.log('Theme system initialized');
}

// Load theme preference from localStorage or system preference
function loadThemeFromStorage() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let themeToApply;
    
    if (savedTheme) {
        themeToApply = savedTheme;
    } else {
        // Use system preference if no saved theme
        themeToApply = systemPrefersDark ? 'dark' : 'light';
    }
    
    applyTheme(themeToApply);
}

// Apply theme to document and update UI
function applyTheme(theme) {
    const html = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Remove any existing theme classes
    html.removeAttribute('data-theme');
    
    // Apply new theme
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.textContent = '☀️';
            themeIcon.setAttribute('aria-label', 'Switch to light mode');
        }
    } else {
        // Light theme is default, no data-theme attribute needed
        if (themeIcon) {
            themeIcon.textContent = '🌙';
            themeIcon.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    
    // Update toggle button accessibility
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', 
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Dispatch custom event for other components to listen to
    document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme }
    }));
}

// Set up theme toggle button functionality
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transition');
        
        applyTheme(newTheme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
        
        // Provide haptic feedback on supported devices
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    });
    
    // Keyboard support for theme toggle
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });
}

// Listen for system theme changes
function handleSystemThemeChange() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', function(e) {
        // Only auto-switch if user hasn't manually set a preference
        const hasManualPreference = localStorage.getItem('theme');
        
        if (!hasManualPreference) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    });
}

// Get current theme
function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
}

// Reset theme to system preference
function resetToSystemTheme() {
    localStorage.removeItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = systemPrefersDark ? 'dark' : 'light';
    applyTheme(systemTheme);
}

// Theme-aware image loading
function setupThemeAwareImages() {
    const themeImages = document.querySelectorAll('[data-src-light][data-src-dark]');
    
    themeImages.forEach(img => {
        const lightSrc = img.getAttribute('data-src-light');
        const darkSrc = img.getAttribute('data-src-dark');
        
        function updateImageSrc() {
            const currentTheme = getCurrentTheme();
            img.src = currentTheme === 'dark' ? darkSrc : lightSrc;
        }
        
        // Set initial image
        updateImageSrc();
        
        // Update on theme change
        document.addEventListener('themeChanged', updateImageSrc);
    });
}

// Theme-aware syntax highlighting
function updateSyntaxHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    const currentTheme = getCurrentTheme();
    
    codeBlocks.forEach(block => {
        block.className = block.className.replace(/hljs-\w+/g, '');
        block.classList.add(`hljs-${currentTheme}`);
    });
}

// CSS transition for smooth theme changes
function addThemeTransition() {
    const style = document.createElement('style');
    style.textContent = `
        .theme-transition,
        .theme-transition *,
        .theme-transition *:before,
        .theme-transition *:after {
            transition: background-color 0.3s ease-in-out,
                       color 0.3s ease-in-out,
                       border-color 0.3s ease-in-out,
                       box-shadow 0.3s ease-in-out !important;
        }
    `;
    document.head.appendChild(style);
}

// High contrast mode detection and handling
function handleHighContrastMode() {
    const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (isHighContrast) {
        document.documentElement.classList.add('high-contrast');
    }
    
    // Listen for changes in contrast preference
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    });
}

// Reduced motion handling
function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.documentElement.classList.add('reduced-motion');
    }
    
    // Listen for changes in motion preference
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.classList.add('reduced-motion');
        } else {
            document.documentElement.classList.remove('reduced-motion');
        }
    });
}

// Initialize additional theme features
document.addEventListener('DOMContentLoaded', function() {
    addThemeTransition();
    setupThemeAwareImages();
    handleHighContrastMode();
    handleReducedMotion();
    
    // Update syntax highlighting on theme change
    document.addEventListener('themeChanged', updateSyntaxHighlighting);
});

// Theme persistence across page navigation
window.addEventListener('beforeunload', function() {
    const currentTheme = getCurrentTheme();
    localStorage.setItem('theme', currentTheme);
});

// Expose theme functions globally
window.Theme = {
    getCurrentTheme,
    applyTheme,
    resetToSystemTheme,
    setupThemeAwareImages,
    updateSyntaxHighlighting
};

// Auto-initialize theme-aware images when new content is loaded
const themeObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const themeImages = node.querySelectorAll('[data-src-light][data-src-dark]');
                    if (themeImages.length > 0) {
                        setupThemeAwareImages();
                    }
                }
            });
        }
    });
});

// Start observing for dynamic content
themeObserver.observe(document.body, {
    childList: true,
    subtree: true
}); 