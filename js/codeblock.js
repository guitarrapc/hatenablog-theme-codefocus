/**
 * Script to provide code block features (copy & wrap toggle)
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    // Get all code blocks
    const codeBlocks = document.querySelectorAll('pre.code');

    // Add buttons to each code block
    codeBlocks.forEach(function (codeBlock) {
      // Create wrapper for code block
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'code-copy-button';
      copyButton.removeAttribute('title'); // Remove title attribute in initial state
      copyButton.setAttribute('aria-label', 'Copy code');

      // Create wrap toggle button
      const wrapToggleButton = document.createElement('button');
      wrapToggleButton.className = 'code-wrap-toggle';
      wrapToggleButton.title = 'Toggle Wrap';
      wrapToggleButton.setAttribute('aria-label', 'Toggle code wrapping');

      // Move code block from parent to wrapper
      const parent = codeBlock.parentNode;
      parent.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);

      // Initial state is no wrap (default)
      codeBlock.classList.add('nowrap');

      // Add buttons to wrapper (order matters: copy, wrap from right)
      wrapper.appendChild(copyButton);
      wrapper.appendChild(wrapToggleButton);

      // Set click event for copy button
      copyButton.addEventListener('click', function () {
        // Temporarily hide button text before copying
        const originalDisplay = copyButton.style.display;
        copyButton.style.display = 'none';

        // Get text from code block
        const code = codeBlock.textContent;

        // Restore button display
        copyButton.style.display = originalDisplay;

        // Copy to clipboard
        navigator.clipboard.writeText(code).then(function () {
          // Copy succeeded
          copyButton.title = 'Copied';
          copyButton.classList.add('copied');

          // Reset after a certain time
          setTimeout(function () {
            copyButton.removeAttribute('title'); // Remove title attribute
            copyButton.classList.remove('copied');
          }, 2000);
        }).catch(function (err) {
          // Copy failed
          console.error('Copy failed:', err);
          copyButton.title = 'Copy failed';
          copyButton.classList.add('copy-error');

          // Reset after a certain time
          setTimeout(function () {
            copyButton.removeAttribute('title'); // Remove title attribute
            copyButton.classList.remove('copy-error');
          }, 2000);
        });
      });

      // Set click event for wrap toggle button
      wrapToggleButton.addEventListener('click', function () {
        codeBlock.classList.toggle('nowrap');
        codeBlock.classList.toggle('wrap');

        // Update button tooltip
        if (codeBlock.classList.contains('nowrap')) {
          wrapToggleButton.title = 'Enable Wrap';
        } else {
          wrapToggleButton.title = 'Disable Wrap';
        }
      });
    });
  });
})();
