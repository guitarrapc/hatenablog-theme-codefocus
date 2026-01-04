/**
 * Script for table of contents button and display functionality
 */
(function () {
  'use strict';

  // Execute after DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Get all articles with table of contents
    const allEntriesWithToc = Array.from(document.querySelectorAll('.entry-content')).filter(entry =>
      entry.querySelector('.table-of-contents')
    );

    if (allEntriesWithToc.length === 0) return; // Do nothing if no table of contents

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

    // Container for TOC list (will be updated dynamically)
    const tocListContainer = document.createElement('div');
    tocListContainer.className = 'toc-list-container';

    // Add elements to floating TOC
    floatingToc.appendChild(topButtonContainer);
    floatingToc.appendChild(tocListContainer);

    // Add elements to body
    document.body.appendChild(tocButton);
    document.body.appendChild(floatingToc);

    // Track current active entry
    let currentActiveEntry = null;
    let currentTocLinks = [];
    let currentHeadingMap = new Map();

    // Function to get the currently visible entry
    function getCurrentVisibleEntry() {
      const viewportCenter = window.innerHeight / 2;

      for (const entry of allEntriesWithToc) {
        const rect = entry.getBoundingClientRect();
        // Check if entry is visible in viewport
        if (rect.top < viewportCenter && rect.bottom > 0) {
          return entry;
        }
      }

      // If no entry is in center, return the first visible one
      for (const entry of allEntriesWithToc) {
        const rect = entry.getBoundingClientRect();
        if (rect.bottom > 0) {
          return entry;
        }
      }

      return allEntriesWithToc[0];
    }

    // Function to update TOC content based on current entry
    function updateTocContent(entry) {
      if (!entry || entry === currentActiveEntry) return;

      currentActiveEntry = entry;

      // Get table of contents for this entry
      const tableOfContents = entry.querySelector('.table-of-contents');
      if (!tableOfContents) return;

      // Clear and update TOC list
      tocListContainer.innerHTML = '';
      const tocClone = tableOfContents.cloneNode(true);
      tocClone.classList = 'floating-toc-list';
      tocListContainer.appendChild(tocClone);

      // Update TOC links
      currentTocLinks = Array.from(floatingToc.querySelectorAll('a'));

      // Set up click handlers for TOC links
      currentTocLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          // Close TOC on small screens
          if (!isWideScreen()) {
            floatingToc.classList.remove('show');
            tocButton.classList.remove('active');
          }
        });
      });

      // Get all heading elements in this entry
      const headings = Array.from(entry.querySelectorAll('h1, h2, h3, h4, h5, h6'));

      // Update heading map
      currentHeadingMap.clear();
      currentTocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          const targetHeading = document.getElementById(targetId);
          if (targetHeading) {
            currentHeadingMap.set(targetHeading, link);
          }
        }
      });
    }

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

    // Initialize TOC content with first visible entry
    updateTocContent(getCurrentVisibleEntry());

    // Close TOC when clicking outside (except on wide screens)
    document.addEventListener('click', function (event) {
      if (!isWideScreen() && !floatingToc.contains(event.target) && event.target !== tocButton && !tocButton.contains(event.target)) {
        floatingToc.classList.remove('show');
        tocButton.classList.remove('active');
      }
    });

    // Set scroll event
    let lastScrollTop = 0;
    const scrollThreshold = 200; // Scroll threshold (px)

    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Determine scroll direction (up/down)
      const isScrollingDown = scrollTop > lastScrollTop;

      // Get currently visible entry
      const visibleEntry = getCurrentVisibleEntry();

      // Update TOC content if entry changed
      updateTocContent(visibleEntry);

      // Check if any entry with TOC is visible
      const anyEntryVisible = allEntriesWithToc.some(entry => {
        const rect = entry.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });

      // Show TOC button if any entry is visible and scroll position is above threshold
      if (anyEntryVisible && scrollTop > scrollThreshold) {
        if (!isWideScreen()) {
          tocButton.style.display = 'block';
        }
      } else {
        tocButton.style.display = 'none';
        floatingToc.classList.remove('show'); // Close TOC in non-visible area
        tocButton.classList.remove('active'); // Reset button state
      }

      // Detect and highlight currently visible heading in current entry
      if (currentActiveEntry && anyEntryVisible) {
        // Clear all active classes
        currentTocLinks.forEach(link => {
          link.classList.remove('active');
          // Remove active class from parent li element
          if (link.parentElement) {
            link.parentElement.classList.remove('active');
          }
        });

        // Get headings from current entry only
        const headings = Array.from(currentActiveEntry.querySelectorAll('h1, h2, h3, h4, h5, h6'));

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
        if (activeHeading && currentHeadingMap.has(activeHeading)) {
          const activeLink = currentHeadingMap.get(activeHeading);
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
