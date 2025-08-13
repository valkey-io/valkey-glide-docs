// This script enhances all `.code-tabs` containers with interactive tabbed
// navigation. It reads the list of labels from the `data-labels` attribute and
// generates clickable buttons that toggle the visibility of each code block.

document.addEventListener('DOMContentLoaded', function () {
  function canon(label) {
    if (!label) return '';
    const s = String(label).trim().toLowerCase();
    if (['node', 'nodejs', 'node.js', 'js', 'javascript'].includes(s)) return 'node.js';
    if (['py', 'python'].includes(s)) return 'python';
    if (['java'].includes(s)) return 'java';
    if (['go', 'golang', 'galang'].includes(s)) return 'go';
    return s;
  }
  function getPreferredLanguage() {
    try {
      return localStorage.getItem('preferred-language') || 'node.js';
    } catch (e) {
      return 'node.js';
    }
  }
  function setPreferredLanguage(value) {
    const c = canon(value);
    try { localStorage.setItem('preferred-language', c); } catch (_) {}
    const ev = new CustomEvent('preferred-language-changed', { detail: { value: c } });
    document.dispatchEvent(ev);
  }

  const tabContainers = document.querySelectorAll('.code-tabs');
  tabContainers.forEach(function (tabsContainer) {
    const labelsAttr = tabsContainer.getAttribute('data-labels') || '[]';
    let labels;
    try {
      labels = JSON.parse(labelsAttr);
      if (!Array.isArray(labels)) labels = [];
    } catch (e) {
      labels = [];
    }
    const tabContents = Array.from(tabsContainer.querySelectorAll('.tab-content'));
    if (labels.length === 0 || tabContents.length === 0) {
      return;
    }

    const preferred = getPreferredLanguage();
    const canonicalLabels = labels.map(canon);
    let activeIndex = canonicalLabels.indexOf(preferred);
    if (activeIndex < 0) activeIndex = 0;

    // Create header for tabs
    const header = document.createElement('div');
    header.className = 'tab-headers';
    labels.forEach(function (label, index) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.dataset.label = label;
      if (index === activeIndex) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', function () {
        // Activate the clicked button and deactivate others
        header.querySelectorAll('button').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        // Show the corresponding tab content and hide the rest
        tabContents.forEach(function (content) {
          if (content.getAttribute('data-label') === label) {
            content.style.display = '';
          } else {
            content.style.display = 'none';
          }
        });
        // Persist and broadcast preference
        setPreferredLanguage(label);
      });
      header.appendChild(btn);
    });

    // Insert the header at the top of the tabs container
    tabsContainer.insertBefore(header, tabsContainer.firstChild);
    // Hide all tab contents except the active one
    tabContents.forEach(function (content, idx) {
      content.style.display = idx === activeIndex ? '' : 'none';
    });

    // Respond to global changes
    document.addEventListener('preferred-language-changed', function (e) {
      const value = e.detail && e.detail.value ? e.detail.value : getPreferredLanguage();
      const idx = canonicalLabels.indexOf(value);
      if (idx === -1) return; // this block doesn't have that language
      // Update header active state
      const buttons = header.querySelectorAll('button');
      buttons.forEach(function (b, i) {
        if (i === idx) b.classList.add('active'); else b.classList.remove('active');
      });
      // Update visible content
      tabContents.forEach(function (content, i) {
        content.style.display = i === idx ? '' : 'none';
      });
    });
  });
});
