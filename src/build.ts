import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Markdoc from '@markdoc/markdoc';

/**
 * Build script for the FakePay documentation site.
 *
 * This script reads Markdown files from the `content` directory, renders
 * them to HTML using Markdoc and writes the resulting pages into the `dist`
 * directory. It also copies static assets (CSS and JavaScript) from the
 * `static` directory into `dist/static`. A navigation menu is generated on
 * every page based on a simple configuration, and relative links are
 * computed so that CSS/JS and other pages resolve correctly from any
 * directory depth.
 */

// Paths to key directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const staticDir = path.join(rootDir, 'static');
const distDir = path.join(rootDir, 'dist');

// Definition of the navigation structure following Diataxis framework
// Now supports 3-level navigation: sections → subsections → items
// Each section can contain direct items or subsections with their own items
// When adding new pages you should update this structure accordingly.
interface NavItem {
  key: string;
  label: string;
}

interface NavSubsection {
  title: string;
  page?: string;  // Optional dedicated page for the subsection
  items: NavItem[];
}

interface NavSection {
  section: string;
  items?: NavItem[];  // Direct items under section
  subsections?: NavSubsection[];  // Grouped items under subsections
}

const navConfig: NavSection[] = [
  {
    section: 'Getting Started',
    items: [
      { key: 'getting-started/overview.md', label: 'Welcome to Valkey GLIDE' }
    ],
    subsections: [
      {
        title: 'Quick Setup',
        items: [
          { key: 'getting-started/quick-setup/environment-setup.md', label: 'Environment Setup' },
          { key: 'getting-started/quick-setup/docker-environment.md', label: 'Docker Compose Setup' },
          { key: 'getting-started/quick-setup/first-connection.md', label: 'First Connection' },
          { key: 'getting-started/quick-setup/basic-operations.md', label: 'Basic Operations' }
        ]
      },
      {
        title: 'Tutorials',
        items: [
          { key: 'getting-started/tutorials/caching-app.md', label: 'Build a Caching Layer' },
          { key: 'getting-started/tutorials/pubsub-notifications.md', label: 'Real-time Notifications' },
          { key: 'getting-started/tutorials/clustering-guide.md', label: 'Working with Valkey Clusters' },
          { key: 'getting-started/tutorials/observability.md', label: 'Adding OpenTelemetry Monitoring' },
          { key: 'getting-started/tutorials/production-ready.md', label: 'Security, Auth, and Deployment' }
        ]
      },
      {
        title: 'Next Steps',
        items: [
          { key: 'getting-started/next-steps.md', label: 'Advanced Features' },
        ]
      },
    ]
  },
  {
    section: 'How-To Guides',
    subsections: [
      {
        title: 'Connection Management',
        items: [
          { key: 'how-to/connection-management/connection-pooling.md', label: 'Connection Pooling' },
          { key: 'how-to/connection-management/failover-handling.md', label: 'Failover Handling' },
          { key: 'how-to/connection-management/cluster-topology.md', label: 'Cluster Topology' },
          { key: 'how-to/connection-management/dynamic-passwords.md', label: 'Dynamic Passwords' }
        ]
      },
      {
        title: 'Security',
        items: [
          { key: 'how-to/security/enable-tls.md', label: 'Enable TLS' },
          { key: 'how-to/security/authentication.md', label: 'Authentication' },
          { key: 'how-to/security/iam-integration.md', label: 'IAM Integration' },
          { key: 'how-to/security/access-control.md', label: 'Access Control' }
        ]
      },
      {
        title: 'Performance',
        items: [
          { key: 'how-to/performance/read-strategies.md', label: 'Read Strategies' },
          { key: 'how-to/performance/batch-operations.md', label: 'Batch Operations' },
          { key: 'how-to/performance/pipelining.md', label: 'Pipelining' },
          { key: 'how-to/performance/client-side-caching.md', label: 'Client-side Caching' },
          { key: 'how-to/performance/optimization-tips.md', label: 'Optimization Tips' }
        ]
      },
      {
        title: 'Operations',
        items: [
          { key: 'how-to/operations/error-handling.md', label: 'Error Handling' },
          { key: 'how-to/operations/timeouts-retries.md', label: 'Timeouts & Retries' },
          { key: 'how-to/operations/cluster-scan.md', label: 'Cluster Scan' },
          { key: 'how-to/operations/multi-slot-commands.md', label: 'Multi-slot Commands' },
          { key: 'how-to/operations/custom-commands.md', label: 'Custom Commands' }
        ]
      },
      {
        title: 'Cloud Deployment',
        items: [
          { key: 'how-to/cloud-deployment/aws-elasticache.md', label: 'AWS ElastiCache' },
          { key: 'how-to/cloud-deployment/aws-memorydb.md', label: 'AWS MemoryDB' },
          { key: 'how-to/cloud-deployment/gcp-memorystore.md', label: 'GCP Memorystore' }
        ]
      },
      {
        title: 'Framework Integration',
        items: [
          { key: 'how-to/framework-integration/spring-boot.md', label: 'Spring Boot' },
          { key: 'how-to/framework-integration/django.md', label: 'Django' },
          { key: 'how-to/framework-integration/express-js.md', label: 'Express.js' },
          { key: 'how-to/framework-integration/gin-gonic.md', label: 'Gin Gonic' },
          { key: 'how-to/framework-integration/asp-net-core.md', label: 'ASP.NET Core' }
        ]
      },
      {
        title: 'Monitoring',
        items: [
          { key: 'how-to/monitoring/logging-setup.md', label: 'Logging Setup' },
          { key: 'how-to/monitoring/metrics-collection.md', label: 'Metrics Collection' },
          { key: 'how-to/monitoring/alerting.md', label: 'Alerting' },
          { key: 'how-to/monitoring/troubleshooting.md', label: 'Troubleshooting' }
        ]
      }
    ]
  },
  {
    section: 'Concepts',
    subsections: [
      {
        title: 'Architecture',
        items: [
          { key: 'concepts/architecture/rust-core-design.md', label: 'Rust Core Design' },
          { key: 'concepts/architecture/multiplexing.md', label: 'Multiplexing' },
          { key: 'concepts/architecture/async-execution.md', label: 'Async Execution' },
          { key: 'concepts/architecture/performance-benefits.md', label: 'Performance Benefits' }
        ]
      },
      {
        title: 'Valkey Integration',
        items: [
          { key: 'concepts/valkey-integration/cluster-concepts.md', label: 'Cluster Concepts' },
          { key: 'concepts/valkey-integration/command-routing.md', label: 'Command Routing' },
          { key: 'concepts/valkey-integration/data-types.md', label: 'Data Types' },
          { key: 'concepts/valkey-integration/modules-support.md', label: 'Modules Support' }
        ]
      },
      {
        title: 'Client Features',
        items: [
          { key: 'concepts/client-features/batching-vs-pipelining.md', label: 'Batching vs Pipelining' },
          { key: 'concepts/client-features/pubsub-model.md', label: 'PubSub Model' },
          { key: 'concepts/client-features/dynamic-authentication.md', label: 'Dynamic Authentication' },
          { key: 'concepts/client-features/read-strategies-deep.md', label: 'Read Strategies Deep Dive' },
          { key: 'concepts/client-features/observability-design.md', label: 'Observability Design' }
        ]
      },
      {
        title: 'Comparison',
        items: [
          { key: 'concepts/comparison/vs-redis-clients.md', label: 'vs Redis Clients' },
          { key: 'concepts/comparison/vs-lettuce.md', label: 'vs Lettuce' },
          { key: 'concepts/comparison/vs-redisson.md', label: 'vs Redisson' }
        ]
      },
      {
        title: 'Limitations',
        items: [
          { key: 'concepts/limitations/known-issues.md', label: 'Known Issues' },
          { key: 'concepts/limitations/unsupported-features.md', label: 'Unsupported Features' },
          { key: 'concepts/limitations/compatibility-matrix.md', label: 'Compatibility Matrix' }
        ]
      }
    ]
  },
  {
    section: 'Reference',
    subsections: [
      {
        title: 'API',
        items: [
          { key: 'reference/api/common/connection-config.md', label: 'Connection Config' },
          { key: 'reference/api/common/command-args.md', label: 'Command Args' },
          { key: 'reference/api/common/response-types.md', label: 'Response Types' }
        ]
      },

      {
        title: 'Commands',
        items: [
          { key: 'reference/api/commands/string-commands.md', label: 'String Commands' },
          { key: 'reference/api/commands/hash-commands.md', label: 'Hash Commands' },
          { key: 'reference/api/commands/list-commands.md', label: 'List Commands' },
          { key: 'reference/api/commands/set-commands.md', label: 'Set Commands' },
          { key: 'reference/api/commands/sorted-set-commands.md', label: 'Sorted Set Commands' },
          { key: 'reference/api/commands/stream-commands.md', label: 'Stream Commands' },
          { key: 'reference/api/commands/pubsub-commands.md', label: 'PubSub Commands' },
          { key: 'reference/api/commands/cluster-commands.md', label: 'Cluster Commands' },
          { key: 'reference/api/commands/module-commands.md', label: 'Module Commands' }
        ]
      },
      {
        title: 'Configuration',
        items: [
          { key: 'reference/configuration/connection-options.md', label: 'Connection Options' },
          { key: 'reference/configuration/security-options.md', label: 'Security Options' },
          { key: 'reference/configuration/performance-options.md', label: 'Performance Options' },
          { key: 'reference/configuration/logging-options.md', label: 'Logging Options' },
          { key: 'reference/configuration/environment-variables.md', label: 'Environment Variables' }
        ]
      },
      {
        title: 'Compatibility',
        items: [
          { key: 'reference/compatibility/valkey-versions.md', label: 'Valkey Versions' },
          { key: 'reference/compatibility/redis-versions.md', label: 'Redis Versions' },
          { key: 'reference/compatibility/language-versions.md', label: 'Language Versions' },
          { key: 'reference/compatibility/platform-support.md', label: 'Platform Support' }
        ]
      },
      {
        title: 'Errors',
        items: [
          { key: 'reference/errors/error-codes.md', label: 'Error Codes' },
          { key: 'reference/errors/exception-types.md', label: 'Exception Types' },
          { key: 'reference/errors/troubleshooting-guide.md', label: 'Troubleshooting Guide' }
        ]
      },
      {
        title: 'Releases',
        items: [
          { key: 'reference/releases/changelog.md', label: 'Changelog' },
          { key: 'reference/releases/release-notes.md', label: 'Release Notes' },
          { key: 'reference/releases/roadmap.md', label: 'Roadmap' }
        ]
      }
    ]
  },
  {
    section: 'Migration',
    items: [
      { key: 'migration/index.md', label: 'Migration Overview' }
    ],
    subsections: [
      {
        title: 'Planning',
        items: [
          { key: 'migration/planning/migration-strategy.md', label: 'Migration Strategy' },
          { key: 'migration/planning/risk-assessment.md', label: 'Risk Assessment' },
          { key: 'migration/planning/testing-approach.md', label: 'Testing Approach' },
          { key: 'migration/planning/rollback-plan.md', label: 'Rollback Plan' }
        ]
      },
      {
        title: 'From Redis Clients',
        items: [
          { key: 'migration/from-redis-clients/list+redirect-to-client-documentation.md', label: 'Client Documentation' }
        ]
      }
    ]
  },
  {
    section: 'Languages',
    subsections: [
      {
        title: 'Java',
        page: 'languages/java/overview.md',
        items: [
          { key: 'languages/java/getting-started/installation.md', label: 'Installation' },
          { key: 'languages/java/getting-started/platform-support.md', label: 'Platform Support' },
          { key: 'languages/java/getting-started/first-app.md', label: 'First App' },
          { key: 'languages/java/how-to/async-patterns.md', label: 'Async Patterns' },
          { key: 'languages/java/how-to/spring-integration.md', label: 'Spring Integration' },
          { key: 'languages/java/how-to/connection-pooling.md', label: 'Connection Pooling' },
          { key: 'languages/java/how-to/error-handling.md', label: 'Error Handling' },
          { key: 'languages/java/how-to/testing-patterns.md', label: 'Testing Patterns' },
          { key: 'languages/java/how-to/performance-tuning.md', label: 'Performance Tuning' },
          { key: 'languages/java/concepts/java-async-model.md', label: 'Java Async Model' },
          { key: 'languages/java/concepts/memory-management.md', label: 'Memory Management' },
          { key: 'languages/java/concepts/thread-safety.md', label: 'Thread Safety' },
          { key: 'languages/java/reference/api-reference.md', label: 'API Reference' },
          { key: 'languages/java/reference/configuration.md', label: 'Configuration' },
          { key: 'languages/java/reference/exceptions.md', label: 'Exceptions' },
          { key: 'languages/java/migration/from-jedis.md', label: 'From Jedis' },
          { key: 'languages/java/migration/from-lettuce.md', label: 'From Lettuce' },
          { key: 'languages/java/migration/from-redisson.md', label: 'From Redisson' },
          { key: 'languages/java/troubleshooting/common-issues.md', label: 'Common Issues' },
          { key: 'languages/java/troubleshooting/performance-debugging.md', label: 'Performance Debugging' },
          { key: 'languages/java/troubleshooting/build-issues.md', label: 'Build Issues' }
        ]
      },
      {
        title: 'Node.js',
        page: 'languages/nodejs/overview.md',
        items: [
          { key: 'languages/nodejs/getting-started/installation.md', label: 'Installation' },
          { key: 'languages/nodejs/getting-started/typescript-setup.md', label: 'TypeScript Setup' },
          { key: 'languages/nodejs/getting-started/first-app.md', label: 'First App' },
          { key: 'languages/nodejs/how-to/async-await.md', label: 'Async/Await' },
          { key: 'languages/nodejs/how-to/express-integration.md', label: 'Express Integration' },
          { key: 'languages/nodejs/how-to/nestjs-integration.md', label: 'NestJS Integration' },
          { key: 'languages/nodejs/how-to/error-handling.md', label: 'Error Handling' },
          { key: 'languages/nodejs/how-to/testing-patterns.md', label: 'Testing Patterns' },
          { key: 'languages/nodejs/concepts/event-loop-integration.md', label: 'Event Loop Integration' },
          { key: 'languages/nodejs/concepts/memory-management.md', label: 'Memory Management' },
          { key: 'languages/nodejs/concepts/clustering.md', label: 'Clustering' },
          { key: 'languages/nodejs/reference/api-reference.md', label: 'API Reference' },
          { key: 'languages/nodejs/reference/typescript-types.md', label: 'TypeScript Types' },
          { key: 'languages/nodejs/reference/configuration.md', label: 'Configuration' },
          { key: 'languages/nodejs/migration/from-ioredis.md', label: 'From ioredis' },
          { key: 'languages/nodejs/migration/from-node-redis.md', label: 'From node-redis' },

        ]
      },
      {
        title: 'Python',
        page: 'languages/python/overview.md',
        items: [
          { key: 'languages/python/getting-started/installation.md', label: 'Installation' },
          { key: 'languages/python/getting-started/virtual-environments.md', label: 'Virtual Environments' },
          { key: 'languages/python/getting-started/first-app.md', label: 'First App' },
          { key: 'languages/python/how-to/async-patterns.md', label: 'Async Patterns' },
          { key: 'languages/python/how-to/django-integration.md', label: 'Django Integration' },
          { key: 'languages/python/how-to/fastapi-integration.md', label: 'FastAPI Integration' },
          { key: 'languages/python/how-to/flask-integration.md', label: 'Flask Integration' },
          { key: 'languages/python/how-to/testing-patterns.md', label: 'Testing Patterns' },
          { key: 'languages/python/concepts/asyncio-integration.md', label: 'Asyncio Integration' },
          { key: 'languages/python/concepts/gil-considerations.md', label: 'GIL Considerations' },
          { key: 'languages/python/concepts/memory-management.md', label: 'Memory Management' },
          { key: 'languages/python/reference/api-reference.md', label: 'API Reference' },
          { key: 'languages/python/reference/type-hints.md', label: 'Type Hints' },
          { key: 'languages/python/reference/configuration.md', label: 'Configuration' },
          { key: 'languages/python/migration/from-redis-py.md', label: 'From redis-py' },
          { key: 'languages/python/migration/from-aioredis.md', label: 'From aioredis' },

        ]
      },
      {
        title: 'Go',
        page: 'languages/go/overview.md',
        items: [
          { key: 'languages/go/getting-started/installation.md', label: 'Installation' },
          { key: 'languages/go/getting-started/cross-compilation.md', label: 'Cross Compilation' },
          { key: 'languages/go/getting-started/first-app.md', label: 'First App' },
          { key: 'languages/go/how-to/context-usage.md', label: 'Context Usage' },
          { key: 'languages/go/how-to/gin-integration.md', label: 'Gin Integration' },
          { key: 'languages/go/how-to/echo-integration.md', label: 'Echo Integration' },
          { key: 'languages/go/how-to/testing-patterns.md', label: 'Testing Patterns' },
          { key: 'languages/go/concepts/goroutine-safety.md', label: 'Goroutine Safety' },
          { key: 'languages/go/concepts/memory-management.md', label: 'Memory Management' },
          { key: 'languages/go/concepts/error-handling.md', label: 'Error Handling' },
          { key: 'languages/go/reference/api-reference.md', label: 'API Reference' },
          { key: 'languages/go/reference/configuration.md', label: 'Configuration' },
          { key: 'languages/go/migration/from-go-redis.md', label: 'From go-redis' },
          { key: 'languages/go/migration/from-redigo.md', label: 'From redigo' },

        ]
      },
      {
        title: 'C#',
        page: 'languages/csharp/overview.md',
        items: [
          { key: 'languages/csharp/getting-started/coming-soon.md', label: 'Coming Soon' },
          { key: 'languages/csharp/migration/from-stackexchange-redis.md', label: 'From StackExchange.Redis' }
        ]
      },

    ]
  }
];

/**
 * Compute the output HTML path for a given Markdown input file.
 * For example, `tutorials/getting-started.md` becomes
 * `tutorials/getting-started.html` inside the dist folder.
 */
function getOutputPath(mdRelPath: string): string {
  const withoutExt = mdRelPath.replace(/\.md$/i, '');
  return `${withoutExt}.html`;
}

/**
 * Compute a relative URL from one file to another. This helper normalises
 * Windows path separators to forward slashes so that the resulting URL
 * can be used in HTML documents regardless of platform.
 */
function relativeUrl(fromFile: string, toFile: string): string {
  const rel = path.relative(path.dirname(fromFile), toFile);
  // Always use forward slashes in URLs
  return rel.replace(/\\/g, '/');
}

/**
 * Generate the HTML for the navigation menu. It accepts the current
 * page's output path so that it can compute correct relative URLs for
 * each link. Now supports 3-level navigation: sections → subsections → items.
 */
function generateNav(currentOutput: string): string {
  const currentAbs = currentOutput;
  let nav = '<nav class="sidebar" aria-label="Main">\n  <div class="sidebar-header">\n    <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">\n      <span class="toggle-icon">‹</span>\n    </button>\n  </div>\n  <div class="sidebar-content">\n';
  
  for (const section of navConfig) {
    nav += `    <div class=\"nav-section\">\n      <div class=\"nav-section-header\"><h3>${section.section}</h3></div>\n`;
    
    // Handle direct items under section (2-level navigation)
    if (section.items && section.items.length > 0) {
      nav += '      <ul class=\"nav-items\">\n';
      for (const item of section.items) {
        const htmlPath = getOutputPath(item.key);
        const targetAbs = path.join(distDir, htmlPath);
        const isActive = path.resolve(targetAbs) === path.resolve(currentAbs);
        const link = relativeUrl(currentOutput, targetAbs);
        nav += `        <li><a class=\"nav-item${isActive ? ' active' : ''}\" href=\"${link}\">${item.label}</a></li>\n`;
      }
      nav += '      </ul>\n';
    }
    
    // Handle subsections (3-level navigation)
    if (section.subsections && section.subsections.length > 0) {
      for (const subsection of section.subsections) {
        let subsectionLink: string;
        let isSubsectionActive = false;
        
        if (subsection.page) {
          // Subsection has its own dedicated page
          const subsectionHtmlPath = getOutputPath(subsection.page);
          const subsectionTargetAbs = path.join(distDir, subsectionHtmlPath);
          subsectionLink = relativeUrl(currentOutput, subsectionTargetAbs);
          isSubsectionActive = path.resolve(subsectionTargetAbs) === path.resolve(currentAbs);
        } else {
          // No dedicated page - link to first item in subsection
          const firstItem = subsection.items[0];
          const firstItemHtmlPath = getOutputPath(firstItem.key);
          const firstItemTargetAbs = path.join(distDir, firstItemHtmlPath);
          subsectionLink = relativeUrl(currentOutput, firstItemTargetAbs);
        }
        
        nav += `      <div class=\"nav-subsection\">\n        <div class=\"nav-subsection-header\"><h4><a class=\"nav-subsection-link${isSubsectionActive ? ' active' : ''}\" href=\"${subsectionLink}\">${subsection.title}</a></h4></div>\n        <ul class=\"nav-subitems\">\n`;
        
        for (const item of subsection.items) {
          const htmlPath = getOutputPath(item.key);
          const targetAbs = path.join(distDir, htmlPath);
          const isActive = path.resolve(targetAbs) === path.resolve(currentAbs);
          const link = relativeUrl(currentOutput, targetAbs);
          nav += `          <li><a class=\"nav-subitem${isActive ? ' active' : ''}\" href=\"${link}\">${item.label}</a></li>\n`;
        }
        
        nav += '        </ul>\n      </div>\n';
      }
    }
    
    nav += '    </div>\n';
  }
  
  nav += '  </div>\n</nav>';
  return nav;
}

/**
 * Post-process HTML content to convert escaped code-tabs HTML back to actual HTML
 */
function postProcessCodeTabs(htmlContent: string): string {
  let processed = htmlContent;
  
  // Multiple passes to handle the complex nested structure
  // Pass 1: Convert all escaped HTML entities
  processed = processed
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  
  // Pass 2: Fix any broken p tag wrapping around divs
  processed = processed
    .replace(/<p><div class="code-tabs"/g, '<div class="code-tabs"')
    .replace(/<p><div class="tab-content"/g, '<div class="tab-content"')
    .replace(/<\/div><\/p>/g, '</div>')
    .replace(/<p><\/div>/g, '</div>');
  
  // Pass 3: Clean up any remaining p tags that wrap single lines
  processed = processed
    .replace(/<p>\s*<\/div>\s*<div class="tab-content"/g, '</div><div class="tab-content"')
    .replace(/<p>\s*<\/div>\s*<\/div>\s*<\/p>/g, '</div></div>');
  
  // Pass 4: Clean up stray closing p tags after tab-content opening tags
  processed = processed
    .replace(/(<div class="tab-content" data-label="[^"]*">)<\/p>/g, '$1')
    .replace(/(<\/div>)\s*<\/div><p>/g, '$1</div>');
  
  return processed;
}

/**
 * Render a single Markdown file to an HTML page. This function
 * loads the Markdown, uses Markdoc to parse and transform it into
 * HTML, then wraps it with a layout including header, navigation and
 * footer. Relative paths to the static assets and home page are
 * computed automatically.
 */
async function renderPage(mdRelPath: string): Promise<void> {
  const mdPath = path.join(contentDir, mdRelPath);
  const outputRel = getOutputPath(mdRelPath);
  const outputPath = path.join(distDir, outputRel);
  const md = await fs.readFile(mdPath, 'utf8');
  // Parse and transform the Markdown to an AST and then to HTML
  const ast = Markdoc.parse(md);
  const config = {
    tags: {
      div: {
        render: 'div',
        attributes: {
          class: { type: String },
          'data-labels': { type: String },
          'data-label': { type: String }
        }
      }
    }
  };
  const content = Markdoc.transform(ast, config);
  let htmlContent = Markdoc.renderers.html(content);
  
  // Post-process to fix code-tabs HTML
  htmlContent = postProcessCodeTabs(htmlContent);
  // Compute relative URLs
  const staticUrl = relativeUrl(outputPath, path.join(distDir, 'static'));
  const indexUrl = relativeUrl(outputPath, path.join(distDir, 'index.html'));
  // Navigation
  const navHtml = generateNav(outputPath);
  // Build full page
  const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Valkey GLIDE Documentation</title>
  <meta name="theme-color" content="#21808d">
  <link rel="stylesheet" href="${staticUrl}/style.css">
</head>
<body>
  <header class="header">
    <div class="header-content">
      <div class="logo"><a class="logo-text" href="${indexUrl}">Valkey GLIDE</a></div>
      <div class="header-controls">
        <label for="globalLanguageSelect">Select language</label>
        <select id="globalLanguageSelect" aria-label="Global language" class="lang-select">
          <option value="node.js">Node.JS</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="go">Go</option>
        </select>
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme"><span class="theme-icon">🌙</span></button>
        <button class="mobile-nav-toggle" id="mobileNavToggle" aria-label="Toggle navigation"><span class="hamburger"></span></button>
      </div>
    </div>
  </header>
  <div class="main-layout">
${navHtml}
    <main class="content">
${htmlContent}
    </main>
  </div>
  <footer class="footer">
    <p>© 2025 Valkey GLIDE Contributors</p>
  </footer>
  <script src="${staticUrl}/code-tabs.js" defer></script>
  <script src="${staticUrl}/ui.js" defer></script>
</body>
</html>
`;
  // Ensure directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, pageHtml);
}

/**
 * Copy static assets from the `static` directory into `dist/static`.
 */
async function copyStatic(): Promise<void> {
  const dest = path.join(distDir, 'static');
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(staticDir);
  for (const f of files) {
    await fs.copyFile(path.join(staticDir, f), path.join(dest, f));
  }
}

/**
 * Build the entire site. Renders each Markdown page defined in
 * `navConfig` as well as the home page, then copies static assets.
 */
async function buildSite(): Promise<void> {
  // Clean existing dist directory
  await fs.rm(distDir, { recursive: true, force: true });
  
  // Build pages from navConfig (now supports 3-level navigation)
  const pages = new Set<string>();
  for (const section of navConfig) {
    // Add direct items under section
    if (section.items) {
      for (const item of section.items) {
        pages.add(item.key);
      }
    }
    
    // Add items from subsections
    if (section.subsections) {
      for (const subsection of section.subsections) {
        // Add optional subsection page
        if (subsection.page) {
          pages.add(subsection.page);
        }
        
        // Add subsection items
        for (const item of subsection.items) {
          pages.add(item.key);
        }
      }
    }
  }
  
  // Always include the index page
  pages.add('index.md');
  
  for (const mdRel of pages) {
    await renderPage(mdRel);
  }
  
  // Copy static assets
  await copyStatic();
}

// Execute the build when run directly
buildSite().catch((err) => {
  console.error(err);
  process.exit(1);
});
