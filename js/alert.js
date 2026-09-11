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

  // Marker must be alone on its line: "[!NOTE]" followed by newline, <br> or end of paragraph.
  // Only spaces and tabs are allowed around it, same as GitHub (not full-width space or &nbsp;),
  // and it must be on the first line of the paragraph (no newline before it)
  const MARKER_PATTERN = /^[ \t]*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(\r?\n|$)/i;

  // Blockquotes already handled while the page was loading
  const processed = new WeakSet();

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

  // Only ASCII whitespace counts as blank, same as GitHub (&nbsp; or full-width space is content)
  function isBlank(text) {
    return !/[^ \t\r\n\f]/.test(text);
  }

  // Any element counts as content, including <br> (the <br> ending the marker line is skipped by the caller)
  function hasContent(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return !isBlank(node.nodeValue);
    }
    return node.nodeType === Node.ELEMENT_NODE;
  }

  // Move a node keeping its state where moveBefore is supported (e.g. iframes are not reloaded)
  function moveNode(parent, node) {
    if (typeof parent.moveBefore === 'function') {
      parent.moveBefore(node, null);
    } else {
      parent.appendChild(node);
    }
  }

  // Whether the marker is followed by any content before `end` (the next marker paragraph)
  function hasBody(marker, end) {
    const { paragraph, markerNode, lineBreak, match } = marker;
    if (!isBlank(markerNode.nodeValue.slice(match[0].length))) {
      return true;
    }
    for (let node = (lineBreak || markerNode).nextSibling; node; node = node.nextSibling) {
      if (hasContent(node)) {
        return true;
      }
    }
    for (let node = paragraph.nextSibling; node && node !== end; node = node.nextSibling) {
      if (hasContent(node)) {
        return true;
      }
    }
    return false;
  }

  function renderAlert(blockquote, marker) {
    const { paragraph, markerNode, lineBreak, match } = marker;

    // Remove marker and the <br> after it. A newline after the marker is kept (not rendered), so that
    // text extraction such as Hatena's requote gives "Note\nbody" instead of gluing the title to the body
    const rest = markerNode.nodeValue.slice(match[0].length - match[2].length);
    if (rest) {
      markerNode.nodeValue = rest;
    } else {
      markerNode.remove();
    }
    if (lineBreak) {
      lineBreak.remove();
    }

    // Marker-only paragraph ("> [!NOTE]\n>\n> text") leaves an empty paragraph
    if (paragraph.children.length === 0 && isBlank(paragraph.textContent)) {
      paragraph.remove();
    }

    const type = match[1].toLowerCase();
    blockquote.classList.add('markdown-alert', 'markdown-alert-' + type);

    const title = document.createElement('p');
    title.className = 'markdown-alert-title';
    title.textContent = ALERT_TITLES[type];
    blockquote.insertBefore(title, blockquote.firstChild);
  }

  function convertBlockquote(blockquote) {
    const markers = Array.from(blockquote.children).map(findMarker).filter(Boolean);

    // A marker without body stays as plain text (same as GitHub)
    const alerts = markers.filter(function (marker, i) {
      return hasBody(marker, markers[i + 1] ? markers[i + 1].paragraph : null);
    });

    // Hatena Blog merges blockquotes separated by blank lines into one,
    // so split it into one alert per marker paragraph. Walk backwards so each
    // segment only holds the nodes up to the next marker.
    for (let i = alerts.length - 1; i >= 0; i--) {
      const paragraph = alerts[i].paragraph;
      let target = blockquote;

      if (paragraph !== blockquote.firstElementChild) {
        target = blockquote.cloneNode(false);
        target.removeAttribute('id');
        // Insert first: moveBefore keeps node state only when moving within the document
        blockquote.after(target);
        let node = paragraph;
        while (node) {
          const next = node.nextSibling;
          moveNode(target, node);
          node = next;
        }
      }

      renderAlert(target, alerts[i]);
    }
  }

  function convertAlerts(isParsed) {
    // Only top-level blockquotes written in Markdown (no class, unlike embeds such as twitter-tweet) are alerts
    const blockquotes = document.querySelectorAll('.entry-content > blockquote:not([class])');

    blockquotes.forEach(function (blockquote) {
      if (processed.has(blockquote)) {
        return;
      }
      // While loading, skip blockquotes the parser may still be filling (nothing follows them yet)
      if (!isParsed && !blockquote.nextSibling && !blockquote.parentNode.nextSibling) {
        return;
      }
      processed.add(blockquote);
      convertBlockquote(blockquote);
    });
  }

  if (document.readyState === 'loading') {
    // Convert blockquotes as soon as they are parsed, so raw "[!NOTE]" quotes are not painted before DOMContentLoaded
    const observer = new MutationObserver(function () {
      convertAlerts(false);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', function () {
      observer.disconnect();
      convertAlerts(true);
    });
  } else {
    convertAlerts(true);
  }
})();
