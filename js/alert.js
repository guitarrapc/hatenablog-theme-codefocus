/**
 * Script to render GitHub-style alerts (`> [!NOTE]` etc.) in Hatena Blog articles
 */
(function () {
  'use strict';

  // Alert types and their titles
  const ALERT_TITLES = {
    note: 'Note',
    tip: 'Tip',
    important: 'Important',
    warning: 'Warning',
    caution: 'Caution',
  };

  // Marker must be alone on its line: "[!NOTE]" followed by newline, <br> or end of paragraph
  const MARKER_PATTERN = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(\r?\n|$)/i;

  // Returns marker info if the element is a paragraph starting with an alert marker
  function findMarker(element) {
    if (element.tagName !== 'P') {
      return null;
    }

    const markerNode = element.firstChild;
    if (!markerNode || markerNode.nodeType !== Node.TEXT_NODE) {
      return null;
    }

    const match = markerNode.nodeValue.match(MARKER_PATTERN);
    if (!match) {
      return null;
    }

    // "[!NOTE]" ends at the text node boundary: next must be <br> or nothing (e.g. not "[!NOTE]<strong>")
    const lineBreak = match[2] ? null : markerNode.nextSibling;
    if (lineBreak && lineBreak.nodeName !== 'BR') {
      return null;
    }

    return { paragraph: element, markerNode: markerNode, lineBreak: lineBreak, match: match };
  }

  function renderAlert(blockquote, marker) {
    const { paragraph, markerNode, lineBreak, match } = marker;

    // Remove marker and the line break after it
    const rest = markerNode.nodeValue.slice(match[0].length);
    if (rest) {
      markerNode.nodeValue = rest;
    } else {
      markerNode.remove();
    }
    if (lineBreak) {
      lineBreak.remove();
    }

    // Marker-only paragraph ("> [!NOTE]\n>\n> text") leaves an empty paragraph
    if (paragraph.children.length === 0 && paragraph.textContent.trim() === '') {
      paragraph.remove();
    }

    const type = match[1].toLowerCase();
    blockquote.classList.add('markdown-alert', 'markdown-alert-' + type);

    const title = document.createElement('p');
    title.className = 'markdown-alert-title';
    title.textContent = ALERT_TITLES[type];
    blockquote.insertBefore(title, blockquote.firstChild);
  }

  function convertAlerts() {
    // Only top-level blockquotes are alerts (same as GitHub)
    const blockquotes = document.querySelectorAll('.entry-content > blockquote:not(.markdown-alert)');

    blockquotes.forEach(function (blockquote) {
      const markers = Array.from(blockquote.children).map(findMarker).filter(Boolean);

      // Hatena Blog merges blockquotes separated by blank lines into one,
      // so split it into one alert per marker paragraph. Walk backwards so each
      // segment only holds the nodes up to the next marker.
      for (let i = markers.length - 1; i >= 0; i--) {
        const paragraph = markers[i].paragraph;
        let target = blockquote;

        if (paragraph !== blockquote.firstElementChild) {
          target = document.createElement('blockquote');
          let node = paragraph;
          while (node) {
            const next = node.nextSibling;
            target.appendChild(node);
            node = next;
          }
          blockquote.after(target);
        }

        renderAlert(target, markers[i]);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', convertAlerts);
  } else {
    convertAlerts();
  }
})();
