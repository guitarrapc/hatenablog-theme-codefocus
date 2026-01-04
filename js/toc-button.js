/**
 * Script for table of contents button and display functionality
 */
(function () {
  'use strict';

  // Execute after DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Check if this is an article page (entry page)
    const entryContent = document.querySelector('.entry-content');
    if (!entryContent) return; // Do nothing if not an article page

    // Get table of contents element
    const tableOfContents = document.querySelector('.entry-content .table-of-contents');
    if (!tableOfContents) return; // Do nothing if no table of contents

    // Create TOC button
    const tocButton = document.createElement('button');
    tocButton.className = 'toc-button';

    // Create element containing TOC text and icon
    const buttonText = document.createElement('span');
    buttonText.className = 'toc-button-text';
    buttonText.textContent = '目次';

    // Create icon element
    const buttonIcon = document.createElement('span');
    buttonIcon.className = 'toc-button-icon';

    // Add elements to button
    tocButton.appendChild(buttonText);
    tocButton.appendChild(buttonIcon);

    // Create floating TOC container
    const floatingToc = document.createElement('div');
    floatingToc.className = 'floating-toc';

    // Create button to scroll to page top
    const topButton = document.createElement('button');
    topButton.className = 'page-top-button';
    topButton.textContent = 'ページトップへ';
    topButton.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Close TOC
      floatingToc.classList.remove('show');
      tocButton.classList.remove('active');
    });

    // Container for page top button
    const topButtonContainer = document.createElement('div');
    topButtonContainer.className = 'page-top-button-container';
    topButtonContainer.appendChild(topButton);

    // Create clone of TOC
    const tocClone = tableOfContents.cloneNode(true);

    // Add class for floating TOC
    tocClone.classList = 'floating-toc-list';

    // Add elements to floating TOC
    floatingToc.appendChild(topButtonContainer);
    floatingToc.appendChild(tocClone);

    // Add elements to body
    document.body.appendChild(tocButton);
    document.body.appendChild(floatingToc);

    // Function to check if screen width is wide enough for auto-expand
    function isWideScreen() {
      return window.innerWidth >= 1540;
    }

    // Function to update TOC display based on screen width
    function updateTocDisplay() {
      if (isWideScreen()) {
        // Auto-expand on wide screens
        floatingToc.classList.add('show', 'auto-expanded');
        tocButton.classList.add('active');
        // Hide button on wide screens as TOC is always visible
        tocButton.style.display = 'none';
      } else {
        // Remove auto-expand class on smaller screens
        floatingToc.classList.remove('auto-expanded');
        // Show button on smaller screens
        tocButton.style.display = '';
        // Don't automatically close if user manually opened it
      }
    }

    // Set click event
    tocButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Don't allow toggle on wide screens (always show)
      if (!isWideScreen()) {
        floatingToc.classList.toggle('show');
        tocButton.classList.toggle('active');
      }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updateTocDisplay();
      }, 250);
    });

    // Initial check on page load
    updateTocDisplay();

    // Handle clicks on links within TOC
    const tocLinks = floatingToc.querySelectorAll('a');
    tocLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // Close TOC
        floatingToc.classList.remove('show');
        tocButton.classList.remove('active');
      });
    });

    // Close TOC when clicking outside (except on wide screens)
    document.addEventListener('click', function (event) {
      if (!isWideScreen() && !floatingToc.contains(event.target) && event.target !== tocButton && !tocButton.contains(event.target)) {
        floatingToc.classList.remove('show');
        tocButton.classList.remove('active');
      }
    });

    // Get all heading elements in the article
    const headings = Array.from(entryContent.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    // Mapping of link destination elements and corresponding TOC link elements
    const headingMap = new Map();

    // Map headings to corresponding TOC links
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetHeading = document.getElementById(targetId);
        if (targetHeading) {
          headingMap.set(targetHeading, link);
        }
      }
    });

    // Set scroll event
    let lastScrollTop = 0;
    const scrollThreshold = 200; // Scroll threshold (px)

    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Determine scroll direction (up/down)
      const isScrollingDown = scrollTop > lastScrollTop;

      // Check if article area is visible
      const entryRect = entryContent.getBoundingClientRect();
      const isEntryVisible = entryRect.top < window.innerHeight && entryRect.bottom > 0;

      // Show TOC button if article area is visible and scroll position is above threshold
      if (isEntryVisible && scrollTop > scrollThreshold) {
        tocButton.style.display = 'block';
      } else {
        tocButton.style.display = 'none';
        floatingToc.classList.remove('show'); // Close TOC in non-visible area
        tocButton.classList.remove('active'); // Reset button state
      }

      // Detect and highlight currently visible heading
      if (isEntryVisible) {
        // Clear all active classes
        tocLinks.forEach(link => {
          link.classList.remove('active');
          // Remove active class from parent li element
          if (link.parentElement) {
            link.parentElement.classList.remove('active');
          }
        });

        // Detect currently visible heading
        // Get the heading closest to the top of the screen among visible headings
        let activeHeading = null;
        let minDistance = Infinity;

        headings.forEach(heading => {
          const rect = heading.getBoundingClientRect();
          // Check if element is visible on screen or just above
          if (rect.top <= 100) { // 100px is an adjustable value
            const distance = Math.abs(rect.top);
            if (distance < minDistance) {
              minDistance = distance;
              activeHeading = heading;
            }
          }
        });

        // Activate corresponding TOC link
        if (activeHeading && headingMap.has(activeHeading)) {
          const activeLink = headingMap.get(activeHeading);
          activeLink.classList.add('active');
          // Add active class to parent li element
          if (activeLink.parentElement) {
            activeLink.parentElement.classList.add('active');
          }
        }
      }

      lastScrollTop = scrollTop;
    });
  });
})();
