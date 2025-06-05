/**
 * Code Highlighting and Interactive Features
 * Provides syntax highlighting and copy-to-clipboard functionality
 */

class CodeHighlighter {
    constructor() {
        this.initializeCodeBlocks();
        this.setupCopyButtons();
    }

    /**
     * Initialize syntax highlighting for all code blocks
     */
    initializeCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            this.highlightSyntax(block);
        });
    }

    /**
     * Simple syntax highlighting
     * @param {HTMLElement} codeBlock - The code block to highlight
     */
    highlightSyntax(codeBlock) {
        let content = codeBlock.innerHTML;
        
        // JavaScript/React syntax highlighting
        content = content
            // Keywords
            .replace(/\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|from|default|async|await|try|catch|finally)\b/g, '<span class="code-keyword">$1</span>')
            // Strings
            .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="code-string">$1$2$3</span>')
            // Numbers
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>')
            // Comments
            .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="code-comment">$1</span>')
            // Functions
            .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="code-function">$1</span>')
            // JSX tags
            .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '$1<span class="code-tag">$2</span>')
            // JSX attributes
            .replace(/\s([a-zA-Z-]+)=/g, ' <span class="code-attribute">$1</span>=');

        codeBlock.innerHTML = content;
    }

    /**
     * Set up copy buttons for code blocks
     */
    setupCopyButtons() {
        const codeExamples = document.querySelectorAll('.code-example');
        codeExamples.forEach(example => {
            this.addCopyButton(example);
        });
    }

    /**
     * Add copy button to a code example
     * @param {HTMLElement} codeExample - The code example container
     */
    addCopyButton(codeExample) {
        const header = codeExample.querySelector('.code-header');
        if (!header) return;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'code-actions';

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋 Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');

        copyButton.addEventListener('click', () => {
            this.copyCode(codeExample, copyButton);
        });

        actionsDiv.appendChild(copyButton);
        header.appendChild(actionsDiv);
    }

    /**
     * Copy code content to clipboard
     * @param {HTMLElement} codeExample - The code example container
     * @param {HTMLElement} button - The copy button
     */
    async copyCode(codeExample, button) {
        const codeBlock = codeExample.querySelector('code');
        if (!codeBlock) return;

        // Get plain text content (removes HTML highlighting)
        const codeText = this.getPlainTextFromCode(codeBlock);

        try {
            await navigator.clipboard.writeText(codeText);
            this.showCopySuccess(button);
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(codeText, button);
        }
    }

    /**
     * Extract plain text from highlighted code
     * @param {HTMLElement} codeBlock - The code block
     * @returns {string} Plain text content
     */
    getPlainTextFromCode(codeBlock) {
        // Create a temporary element to get the text content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = codeBlock.innerHTML
            .replace(/<span[^>]*>/g, '')
            .replace(/<\/span>/g, '')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
        
        return tempDiv.textContent || tempDiv.innerText || '';
    }

    /**
     * Show copy success feedback
     * @param {HTMLElement} button - The copy button
     */
    showCopySuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copied!';
        button.style.background = 'var(--success-color, #4caf50)';
        button.style.color = 'white';
        button.style.borderColor = 'var(--success-color, #4caf50)';

        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 2000);
    }

    /**
     * Fallback copy method for older browsers
     * @param {string} text - Text to copy
     * @param {HTMLElement} button - The copy button
     */
    fallbackCopyTextToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showCopySuccess(button);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }

        document.body.removeChild(textArea);
    }
}

/**
 * Sidebar navigation for content pages
 */
class SidebarNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.generateSidebar();
        this.updateActiveSection();
        this.setupScrollSpy();
    }

    /**
     * Generate sidebar navigation from page headings
     */
    generateSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const headings = document.querySelectorAll('.main-content-area h2, .main-content-area h3');
        if (headings.length === 0) return;

        const sidebarNav = document.createElement('ul');
        sidebarNav.className = 'sidebar-nav';

        headings.forEach((heading, index) => {
            // Create ID if it doesn't exist
            if (!heading.id) {
                heading.id = this.createSlug(heading.textContent);
            }

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            a.className = heading.tagName.toLowerCase() === 'h3' ? 'subsection' : '';

            li.appendChild(a);
            sidebarNav.appendChild(li);
        });

        // Clear existing content and add new navigation
        sidebar.innerHTML = `
            <h3 class="sidebar-title">On This Page</h3>
        `;
        sidebar.appendChild(sidebarNav);
    }

    /**
     * Create URL-friendly slug from text
     * @param {string} text - Text to convert
     * @returns {string} URL slug
     */
    createSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Update active section based on scroll position
     */
    updateActiveSection() {
        const headings = document.querySelectorAll('.main-content-area h2, .main-content-area h3');
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

        let currentSection = '';
        
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                currentSection = heading.id;
            }
        });

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Set up scroll spy for sidebar navigation
     */
    setupScrollSpy() {
        let ticking = false;

        const updateOnScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', updateOnScroll);
        
        // Smooth scrolling for sidebar links
        document.addEventListener('click', (e) => {
            if (e.target.matches('.sidebar-nav a')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize code highlighting
    new CodeHighlighter();
    
    // Initialize sidebar navigation
    new SidebarNavigation();
});

// Export for use in other modules
export { CodeHighlighter, SidebarNavigation }; 