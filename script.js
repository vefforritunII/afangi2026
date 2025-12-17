// ========================================
// Vefforritun II - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
});

// ========================================
// Navigation
// ========================================
function initNavigation() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class when past hero
    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay based on element position
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const navHeight = document.getElementById('nav')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// Markdown Rendering (for content pages)
// ========================================
async function loadMarkdownContent(filePath, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('Failed to load content');

    const markdown = await response.text();
    container.innerHTML = parseMarkdown(markdown);

    // Re-initialize scroll animations for new content
    initScrollAnimations();
  } catch (error) {
    console.error('Error loading markdown:', error);
    container.innerHTML = '<p>Villa kom upp við að sækja efni.</p>';
  }
}

// Simple Markdown Parser
function parseMarkdown(markdown) {
  let html = markdown
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // Headers
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')

    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/___(.*?)___/gim, '<strong><em>$1</em></strong>')
    .replace(/__(.*?)__/gim, '<strong>$1</strong>')
    .replace(/_(.*?)_/gim, '<em>$1</em>')

    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`(.*?)`/gim, '<code>$1</code>')

    // Links
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')

    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" loading="lazy">')

    // Blockquotes
    .replace(/^\&gt; (.*$)/gim, '<blockquote><p>$1</p></blockquote>')

    // Horizontal rules
    .replace(/^---$/gim, '<hr>')

    // Unordered lists
    .replace(/^\s*[-*+] (.*$)/gim, '<li>$1</li>')

    // Ordered lists
    .replace(/^\s*\d+\. (.*$)/gim, '<li>$1</li>')

    // Paragraphs
    .replace(/\n\n/gim, '</p><p>')

    // Line breaks
    .replace(/\n/gim, '<br>');

  // Wrap list items
  html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

  // Clean up multiple ul tags
  html = html.replace(/<\/ul>\s*<ul>/gim, '');

  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/gim, '');
  html = html.replace(/<p>\s*<(h[1-6]|ul|ol|pre|blockquote|hr)/gim, '<$1');
  html = html.replace(/<\/(h[1-6]|ul|ol|pre|blockquote)>\s*<\/p>/gim, '</$1>');

  return html;
}

// ========================================
// Page Transitions
// ========================================
function initPageTransitions() {
  // Add transition class on link click
  document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto')) return;

      e.preventDefault();
      document.body.classList.add('page-transition');

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}

// ========================================
// Export for use in content pages
// ========================================
window.VefII = {
  loadMarkdownContent,
  parseMarkdown,
  initScrollAnimations
};
