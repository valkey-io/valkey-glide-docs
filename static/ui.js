// Theme toggle and mobile navigation interactions
(function () {
  // Language preference helpers
  function canon(label) {
    if (!label) return '';
    const s = String(label).trim().toLowerCase();
    if (['node', 'nodejs', 'node.js', 'js', 'javascript'].includes(s)) return 'node.js';
    if (['py', 'python'].includes(s)) return 'python';
    if (['java'].includes(s)) return 'java';
    // Handle Go/Golang/Galang labels
    if (['go', 'golang', 'galang'].includes(s)) return 'go';
    return s;
  }

  function getPreferredLanguage() {
    try {
      const v = localStorage.getItem('preferred-language');
      return v || 'node.js';
    } catch (_) {
      return 'node.js';
    }
  }

  function setPreferredLanguage(value) {
    const c = canon(value);
    try { localStorage.setItem('preferred-language', c); } catch (_) {}
    const ev = new CustomEvent('preferred-language-changed', { detail: { value: c } });
    document.dispatchEvent(ev);
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      const icon = toggle.querySelector('.theme-icon');
      if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    try { sessionStorage.setItem('theme', theme); } catch (_) {}
  }

  function initTheme() {
    let saved = 'light';
    try { saved = sessionStorage.getItem('theme') || 'light'; } catch (_) {}
    applyTheme(saved);
  }

  function initToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-color-scheme') || 'light';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  function initSidebarToggle() {
    const btn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (!btn || !sidebar) return;
    
    // Load saved state
    let isCollapsed = false;
    try {
      isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    } catch (_) {}
    
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    }
    
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      sidebar.classList.toggle('collapsed');
      const collapsed = sidebar.classList.contains('collapsed');
      
      // Save state
      try {
        localStorage.setItem('sidebar-collapsed', collapsed.toString());
      } catch (_) {}
    });
  }

  function initMobileNav() {
    const btn = document.getElementById('mobileNavToggle');
    const sidebar = document.querySelector('.sidebar');
    if (!btn || !sidebar) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      sidebar.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.sidebar') && !e.target.closest('#mobileNavToggle')) {
        sidebar.classList.remove('open');
      }
    });
  }

  function initLanguageSelect() {
    const select = document.getElementById('globalLanguageSelect');
    if (!select) return;
    // Set initial value from storage
    const pref = getPreferredLanguage();
    select.value = pref;
    select.addEventListener('change', function () {
      setPreferredLanguage(select.value);
    });
    // Keep the select in sync if user clicks a tab
    document.addEventListener('preferred-language-changed', function (e) {
      const val = e.detail && e.detail.value ? e.detail.value : getPreferredLanguage();
      if (select.value !== val) select.value = val;
    });
  }

  function initNavigationToggle() {
    // Helper function to expand a section or subsection
    const expandContainer = (container, toggle, content, storageKey) => {
      container.removeAttribute('data-collapsed');
      toggle.setAttribute('aria-expanded', 'true');
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.opacity = '1';
      try {
        localStorage.setItem(storageKey, 'false');
      } catch (_) {}
    };

    // Helper function to collapse a section or subsection
    const collapseContainer = (container, toggle, content, storageKey) => {
      container.setAttribute('data-collapsed', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      content.style.maxHeight = '0';
      content.style.opacity = '0';
      try {
        localStorage.setItem(storageKey, 'true');
      } catch (_) {}
    };

    // Auto-expand subsections containing active items
    const autoExpandActiveItems = () => {
      // Find active navigation items
      const activeItems = document.querySelectorAll('.nav-subitem.active, .nav-item.active');
      
      activeItems.forEach(activeItem => {
        // Check if it's in a subsection
        const subsection = activeItem.closest('.nav-subsection');
        if (subsection) {
          const subsectionToggle = subsection.querySelector('.nav-subsection-toggle');
          const subsectionContent = subsection.querySelector('.nav-subsection-content');
          const subsectionId = subsection.getAttribute('data-subsection');
          
          if (subsectionToggle && subsectionContent && subsectionId) {
            // First, collapse all other subsections within the same section (accordion behavior)
            const parentSection = subsection.closest('.nav-section');
            if (parentSection) {
              parentSection.querySelectorAll('.nav-subsection').forEach(otherSubsection => {
                if (otherSubsection !== subsection) {
                  const otherToggle = otherSubsection.querySelector('.nav-subsection-toggle');
                  const otherContent = otherSubsection.querySelector('.nav-subsection-content');
                  const otherSubId = otherSubsection.getAttribute('data-subsection');
                  
                  if (otherToggle && otherContent && otherSubId) {
                    collapseContainer(otherSubsection, otherToggle, otherContent, `nav-subsection-${otherSubId}-collapsed`);
                  }
                }
              });
            }
            
            // Then expand this subsection
            expandContainer(
              subsection, 
              subsectionToggle, 
              subsectionContent, 
              `nav-subsection-${subsectionId}-collapsed`
            );
            
            // Add class for styling fallback
            subsection.classList.add('has-active-item');
          }
        }
        
        // Also ensure the parent section is expanded and collapse other sections
        const section = activeItem.closest('.nav-section');
        if (section) {
          const sectionToggle = section.querySelector('.nav-section-toggle');
          const sectionContent = section.querySelector('.nav-section-content');
          const sectionId = section.getAttribute('data-section');
          
          if (sectionToggle && sectionContent && sectionId) {
            // First, collapse all other sections (accordion behavior)
            document.querySelectorAll('.nav-section').forEach(otherSection => {
              if (otherSection !== section) {
                const otherToggle = otherSection.querySelector('.nav-section-toggle');
                const otherContent = otherSection.querySelector('.nav-section-content');
                const otherSectionId = otherSection.getAttribute('data-section');
                
                if (otherToggle && otherContent && otherSectionId) {
                  collapseContainer(otherSection, otherToggle, otherContent, `nav-section-${otherSectionId}-collapsed`);
                }
              }
            });
            
            // Then expand this section
            expandContainer(
              section, 
              sectionToggle, 
              sectionContent, 
              `nav-section-${sectionId}-collapsed`
            );
          }
        }
      });
    };

    // Initialize collapse all button
    const collapseAllBtn = document.getElementById('navCollapseAll');
    if (collapseAllBtn) {
      // Check if all sections are collapsed to set initial state
      const updateCollapseAllState = () => {
        const sections = document.querySelectorAll('.nav-section');
        const collapsedSections = document.querySelectorAll('.nav-section[data-collapsed="true"]');
        const allCollapsed = sections.length > 0 && sections.length === collapsedSections.length;
        
        collapseAllBtn.setAttribute('data-state', allCollapsed ? 'collapsed' : 'expanded');
        collapseAllBtn.setAttribute('aria-label', allCollapsed ? 'Expand all sections' : 'Collapse all sections');
        collapseAllBtn.setAttribute('title', allCollapsed ? 'Expand all sections' : 'Collapse all sections');
      };
      
      collapseAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const currentState = collapseAllBtn.getAttribute('data-state');
        const shouldCollapse = currentState !== 'collapsed';
        
        // Toggle all sections
        document.querySelectorAll('.nav-section').forEach(section => {
          const toggle = section.querySelector('.nav-section-toggle');
          const content = section.querySelector('.nav-section-content');
          const sectionId = section.getAttribute('data-section');
          
          if (!toggle || !content || !sectionId) return;
          
          if (shouldCollapse) {
            collapseContainer(section, toggle, content, `nav-section-${sectionId}-collapsed`);
          } else {
            expandContainer(section, toggle, content, `nav-section-${sectionId}-collapsed`);
          }
        });
        
        // Toggle all subsections
        document.querySelectorAll('.nav-subsection').forEach(subsection => {
          const toggle = subsection.querySelector('.nav-subsection-toggle');
          const content = subsection.querySelector('.nav-subsection-content');
          const subsectionId = subsection.getAttribute('data-subsection');
          
          if (!toggle || !content || !subsectionId) return;
          
          if (shouldCollapse) {
            collapseContainer(subsection, toggle, content, `nav-subsection-${subsectionId}-collapsed`);
          } else {
            expandContainer(subsection, toggle, content, `nav-subsection-${subsectionId}-collapsed`);
          }
        });
        
        updateCollapseAllState();
      });
      
      // Set initial state after other toggles are initialized
      setTimeout(() => {
        updateCollapseAllState();
        // Since everything starts collapsed, set the button to "collapsed" state initially
        collapseAllBtn.setAttribute('data-state', 'collapsed');
        collapseAllBtn.setAttribute('aria-label', 'Expand all sections');
        collapseAllBtn.setAttribute('title', 'Expand all sections');
      }, 100);
    }
    
    // Initialize section toggles
    const sectionToggles = document.querySelectorAll('.nav-section-toggle');
    sectionToggles.forEach(toggle => {
      const section = toggle.closest('.nav-section');
      const sectionId = section.getAttribute('data-section');
      const content = section.querySelector('.nav-section-content');
      
      if (!sectionId || !content) return;
      
      // Load saved state, but default to collapsed
      let isCollapsed = true; // Default to collapsed
      try {
        const saved = localStorage.getItem(`nav-section-${sectionId}-collapsed`);
        if (saved !== null) {
          isCollapsed = saved === 'true';
        }
      } catch (_) {}
      
      // Apply initial state
      if (isCollapsed) {
        section.setAttribute('data-collapsed', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
      } else {
        section.removeAttribute('data-collapsed');
        toggle.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      }
      
      // Add click handler
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const isCurrentlyCollapsed = section.hasAttribute('data-collapsed');
        
        if (isCurrentlyCollapsed) {
          // First, collapse all other sections (accordion behavior)
          document.querySelectorAll('.nav-section').forEach(otherSection => {
            if (otherSection !== section) {
              const otherToggle = otherSection.querySelector('.nav-section-toggle');
              const otherContent = otherSection.querySelector('.nav-section-content');
              const otherSectionId = otherSection.getAttribute('data-section');
              
              if (otherToggle && otherContent && otherSectionId) {
                collapseContainer(otherSection, otherToggle, otherContent, `nav-section-${otherSectionId}-collapsed`);
              }
            }
          });
          
          // Then expand this section
          expandContainer(section, toggle, content, `nav-section-${sectionId}-collapsed`);
          
          // Auto-expand all subsections within this section with a slight delay for better UX
          const subsections = section.querySelectorAll('.nav-subsection');
          subsections.forEach((subsection, index) => {
            const subToggle = subsection.querySelector('.nav-subsection-toggle');
            const subContent = subsection.querySelector('.nav-subsection-content');
            const subId = subsection.getAttribute('data-subsection');
            
            if (subToggle && subContent && subId) {
              // Add a small delay for each subsection to create a cascading effect
              setTimeout(() => {
                expandContainer(subsection, subToggle, subContent, `nav-subsection-${subId}-collapsed`);
              }, index * 50);
            }
          });
        } else {
          collapseContainer(section, toggle, content, `nav-section-${sectionId}-collapsed`);
        }
        
        // Update collapse all button state
        if (collapseAllBtn) {
          setTimeout(() => {
            const sections = document.querySelectorAll('.nav-section');
            const collapsedSections = document.querySelectorAll('.nav-section[data-collapsed="true"]');
            const allCollapsed = sections.length > 0 && sections.length === collapsedSections.length;
            
            collapseAllBtn.setAttribute('data-state', allCollapsed ? 'collapsed' : 'expanded');
            collapseAllBtn.setAttribute('aria-label', allCollapsed ? 'Expand all sections' : 'Collapse all sections');
            collapseAllBtn.setAttribute('title', allCollapsed ? 'Expand all sections' : 'Collapse all sections');
          }, 50);
        }
      });
    });
    
    // Initialize subsection toggles
    const subsectionToggles = document.querySelectorAll('.nav-subsection-toggle');
    subsectionToggles.forEach(toggle => {
      const subsection = toggle.closest('.nav-subsection');
      const subsectionId = subsection.getAttribute('data-subsection');
      const content = subsection.querySelector('.nav-subsection-content');
      
      if (!subsectionId || !content) return;
      
      // Load saved state, but default to collapsed
      let isCollapsed = true; // Default to collapsed
      try {
        const saved = localStorage.getItem(`nav-subsection-${subsectionId}-collapsed`);
        if (saved !== null) {
          isCollapsed = saved === 'true';
        }
      } catch (_) {}
      
      // Apply initial state
      if (isCollapsed) {
        subsection.setAttribute('data-collapsed', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
      } else {
        subsection.removeAttribute('data-collapsed');
        toggle.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      }
      
      // Add click handler
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const isCurrentlyCollapsed = subsection.hasAttribute('data-collapsed');
        
        if (isCurrentlyCollapsed) {
          // First, collapse all other subsections within the same section (accordion behavior)
          const parentSection = subsection.closest('.nav-section');
          if (parentSection) {
            parentSection.querySelectorAll('.nav-subsection').forEach(otherSubsection => {
              if (otherSubsection !== subsection) {
                const otherToggle = otherSubsection.querySelector('.nav-subsection-toggle');
                const otherContent = otherSubsection.querySelector('.nav-subsection-content');
                const otherSubId = otherSubsection.getAttribute('data-subsection');
                
                if (otherToggle && otherContent && otherSubId) {
                  collapseContainer(otherSubsection, otherToggle, otherContent, `nav-subsection-${otherSubId}-collapsed`);
                }
              }
            });
          }
          
          // Then expand this subsection
          expandContainer(subsection, toggle, content, `nav-subsection-${subsectionId}-collapsed`);
        } else {
          collapseContainer(subsection, toggle, content, `nav-subsection-${subsectionId}-collapsed`);
        }
      });
    });
    
    // Add click handlers to navigation items for auto-expansion
    const addNavItemClickHandlers = () => {
      document.querySelectorAll('.nav-item, .nav-subitem').forEach(navItem => {
        navItem.addEventListener('click', function(e) {
          // Small delay to allow page navigation to start
          setTimeout(() => {
            // Find the subsection containing this item
            const subsection = navItem.closest('.nav-subsection');
            if (subsection) {
              const subsectionToggle = subsection.querySelector('.nav-subsection-toggle');
              const subsectionContent = subsection.querySelector('.nav-subsection-content');
              const subsectionId = subsection.getAttribute('data-subsection');
              
              if (subsectionToggle && subsectionContent && subsectionId) {
                // First, collapse all other subsections within the same section (accordion behavior)
                const parentSection = subsection.closest('.nav-section');
                if (parentSection) {
                  parentSection.querySelectorAll('.nav-subsection').forEach(otherSubsection => {
                    if (otherSubsection !== subsection) {
                      const otherToggle = otherSubsection.querySelector('.nav-subsection-toggle');
                      const otherContent = otherSubsection.querySelector('.nav-subsection-content');
                      const otherSubId = otherSubsection.getAttribute('data-subsection');
                      
                      if (otherToggle && otherContent && otherSubId) {
                        collapseContainer(otherSubsection, otherToggle, otherContent, `nav-subsection-${otherSubId}-collapsed`);
                      }
                    }
                  });
                }
                
                // Then expand this subsection
                expandContainer(
                  subsection, 
                  subsectionToggle, 
                  subsectionContent, 
                  `nav-subsection-${subsectionId}-collapsed`
                );
              }
            }
            
            // Also ensure the parent section is expanded and collapse other sections
            const section = navItem.closest('.nav-section');
            if (section) {
              const sectionToggle = section.querySelector('.nav-section-toggle');
              const sectionContent = section.querySelector('.nav-section-content');
              const sectionId = section.getAttribute('data-section');
              
              if (sectionToggle && sectionContent && sectionId) {
                // First, collapse all other sections (accordion behavior)
                document.querySelectorAll('.nav-section').forEach(otherSection => {
                  if (otherSection !== section) {
                    const otherToggle = otherSection.querySelector('.nav-section-toggle');
                    const otherContent = otherSection.querySelector('.nav-section-content');
                    const otherSectionId = otherSection.getAttribute('data-section');
                    
                    if (otherToggle && otherContent && otherSectionId) {
                      collapseContainer(otherSection, otherToggle, otherContent, `nav-section-${otherSectionId}-collapsed`);
                    }
                  }
                });
                
                // Then expand this section
                expandContainer(
                  section, 
                  sectionToggle, 
                  sectionContent, 
                  `nav-section-${sectionId}-collapsed`
                );
              }
            }
          }, 10);
        });
      });
    };

    // Add click handlers to subsection links to auto-expand
    const addSubsectionLinkHandlers = () => {
      document.querySelectorAll('.nav-subsection-link').forEach(link => {
        link.addEventListener('click', function(e) {
          const subsection = link.closest('.nav-subsection');
          if (subsection) {
            const subToggle = subsection.querySelector('.nav-subsection-toggle');
            const subContent = subsection.querySelector('.nav-subsection-content');
            const subId = subsection.getAttribute('data-subsection');
            
            if (subToggle && subContent && subId) {
              // First, collapse all other subsections within the same section (accordion behavior)
              const parentSection = subsection.closest('.nav-section');
              if (parentSection) {
                parentSection.querySelectorAll('.nav-subsection').forEach(otherSubsection => {
                  if (otherSubsection !== subsection) {
                    const otherToggle = otherSubsection.querySelector('.nav-subsection-toggle');
                    const otherContent = otherSubsection.querySelector('.nav-subsection-content');
                    const otherSubId = otherSubsection.getAttribute('data-subsection');
                    
                    if (otherToggle && otherContent && otherSubId) {
                      collapseContainer(otherSubsection, otherToggle, otherContent, `nav-subsection-${otherSubId}-collapsed`);
                    }
                  }
                });
              }
              
              // Then expand the subsection to show all items
              expandContainer(subsection, subToggle, subContent, `nav-subsection-${subId}-collapsed`);
            }
          }
        });
      });
    };

    // Initialize subsection link handlers
    addSubsectionLinkHandlers();
    
    // Auto-expand sections/subsections containing active items on page load
    const autoExpandOnLoad = () => {
      // This runs immediately when the page loads to ensure active items are visible
      autoExpandActiveItems();
    };

    // Run auto-expansion immediately for page load
    autoExpandOnLoad();
    
    // Initialize navigation item click handlers
    addNavItemClickHandlers();
    
    // Auto-expand sections/subsections containing active items after initialization
    setTimeout(() => {
      autoExpandActiveItems();
      // Update collapse all button state after auto-expansion
      if (collapseAllBtn) {
        setTimeout(() => {
          const sections = document.querySelectorAll('.nav-section');
          const collapsedSections = document.querySelectorAll('.nav-section[data-collapsed="true"]');
          const allCollapsed = sections.length > 0 && sections.length === collapsedSections.length;
          
          collapseAllBtn.setAttribute('data-state', allCollapsed ? 'collapsed' : 'expanded');
          collapseAllBtn.setAttribute('aria-label', allCollapsed ? 'Expand all sections' : 'Collapse all sections');
          collapseAllBtn.setAttribute('title', allCollapsed ? 'Expand all sections' : 'Collapse all sections');
        }, 100);
      }
    }, 150);
    
    // Update max-heights when window resizes
    window.addEventListener('resize', function() {
      document.querySelectorAll('.nav-section-content, .nav-subsection-content').forEach(content => {
        const container = content.closest('[data-collapsed]');
        if (!container || container.hasAttribute('data-collapsed')) return;
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      });
    });
  }

  // Optional: Clear navigation state for testing (remove this in production)
  // localStorage.clear();

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initToggle();
    initSidebarToggle();
    initMobileNav();
    initLanguageSelect();
    initNavigationToggle();
  });
})();
