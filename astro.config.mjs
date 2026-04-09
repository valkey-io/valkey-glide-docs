// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";

function collapsed(isCollapsed = false, sidebarItems) {
  return sidebarItems.map((item) => {
    if (item.items) {
      return {
        ...item,
        collapsed: isCollapsed,
        items: collapsed(isCollapsed, item.items),
      };
    }

    if (item.autogenerate) {
      return {
        ...item,
        collapsed: isCollapsed,
      };
    }

    return item;
  });
}

const isDev = process.argv.includes("dev");
const googleTagManagerHeader = isDev
  ? []
  : [
      {
        tag: /** @type {const} */ ("script"),
        content: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-5SQ3G3KB');`,
      },
    ];
const googleTagManagerBody = isDev
  ? {}
  : {
      SkipLink: "./src/components/SkipLinkWithGTM.astro",
    };

export default defineConfig({
  site: "https://glide.valkey.io",
  integrations: [
    mermaid({
      theme: "default",
      autoTheme: true,
    }),
    starlight({
      title: "Valkey Glide",
      head: [...googleTagManagerHeader],
      components: { ...googleTagManagerBody },
      logo: {
        light: "./src/assets/valkey-glide-logo-with-name-light.svg",
        dark: "./src/assets/valkey-glide-logo-with-name-dark.svg",
        replacesTitle: true,
      },
      customCss: ["./src/styles/custom.css"],
      favicon: "/favicon-32x32.png",
      editLink: {
        baseUrl: "https://github.com/valkey-io/valkey-glide-docs/edit/main/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/valkey-io/valkey-glide",
        },
      ],
      sidebar: [
        {
          label: "Overview",
          slug: "overview",
        },
        {
          label: "What's New",
          slug: "releases",
        },
        {
          label: "Learn",
          items: [
            {
              label: "Quick Start",
              slug: "getting-started/quickstart",
            },
            {
              label: "Basic Operations",
              slug: "getting-started/basic-operations",
            },
            {
              label: "Concepts",
              collapsed: true,
              items: [
                "concepts/architecture/rust-core-design",
                "concepts/architecture/async-execution",
              ],
            },
            {
              label: "Commands API",
              collapsed: true,
              items: ["commands/valkey-string"],
            },
            {
              label: "Core Features",
              collapsed: true,
              autogenerate: { directory: "concepts/client-features" },
            },
            {
              label: "Tutorials",
              collapsed: true,
              items: [
                {
                  slug: "tutorials/tls",
                },
                {
                  label: "Lua Scripting",
                  autogenerate: { directory: "tutorials/lua-scripting" },
                },
                {
                  label: "Pub/Sub",
                  autogenerate: { directory: "tutorials/pubsub" },
                },
              ],
            },
          ],
        },
        {
          label: "How-To Guides",
          collapsed: true,
          items: [
            "how-to/installation",
            "how-to/client-initialization",
            "how-to/connection-management",
            "how-to/publish-and-subscribe-messages",
            "how-to/send-batch-commands",
            "how-to/synchronous-connection",
            "how-to/execute-custom-scripts",
            "how-to/load-and-execute-functions",
            "how-to/scan-cluster",
            "how-to/modules-api",
            {
              label: "Security",
              items: [
                "how-to/security/authentication",
                "how-to/security/dynamic-authentication",
                "how-to/security/tls",
                // "how-to/security/best-practices", // TODO: page not yet created
                {
                  label: "AWS Integrations",
                  items: [
                    {
                      label: "IAM Authentication with GLIDE",
                      slug: "how-to/security/iam-integration",
                    },
                    {
                      label: "IAM Authentication using AWS SDK",
                      slug: "how-to/security/iam-integration-using-aws-sdk",
                    },
                  ],
                },
              ],
            },
            {
              label: "Connections",
              items: [
                "how-to/connections/configure-lazy-connection",
                "how-to/connections/limit-inflight-requests",
                "how-to/connections/read-strategy",
                "how-to/connections/timeouts-and-reconnect-strategy",
              ],
            },
            {
              label: "Monitoring",
              items: [
                "how-to/monitoring/logging",
                "how-to/monitoring/open-telemetry",
                "how-to/monitoring/tracking-resources",
              ],
            },
          ],
        },
        {
          label: "Migration",
          collapsed: true,
          items: collapsed(true, [
            "migration/overview",
            {
              label: "Java",
              collapsed: true,
              items: [
                "migration/java",
                {
                  label: "From Jedis",
                  items: [
                    "migration/java/jedis",
                    {
                      label: "Jedis Compatibility Layer",

                      items: [
                        "migration/java/jedis/jedis-compatibility-layer",
                        "migration/java/jedis/jedis-compatibility-layer/instructions",
                        "migration/java/jedis/jedis-compatibility-layer/supported-features",
                        "migration/java/jedis/jedis-compatibility-layer/configurations-mapping",
                        "migration/java/jedis/jedis-compatibility-layer/getting-help",
                      ],
                    },
                    {
                      label: "Manual Migrations",
                      items: [
                        "migration/java/jedis/manual-migrations",
                        "migration/java/jedis/manual-migrations/installation",
                        "migration/java/jedis/manual-migrations/connection-setup",
                        "migration/java/jedis/manual-migrations/command-comparison-jedis-glide",
                        "migration/java/jedis/manual-migrations/command-comparison-chart",
                      ],
                    },
                  ],
                },
                {
                  label: "From Lettuce",
                  items: [
                    "migration/java/lettuce",
                    "migration/java/lettuce/installation",
                    "migration/java/lettuce/connection-setup",
                    "migration/java/lettuce/command-comparison-lettuce-glide",
                    "migration/java/lettuce/command-comparison-chart",
                  ],
                },
                {
                  label: "From Redisson",
                  items: [
                    "migration/java/redisson",
                    "migration/java/redisson/installation",
                    "migration/java/redisson/connection-setup",
                    "migration/java/redisson/key-differences-summary",
                    "migration/java/redisson/command-comparison-redisson-glide",
                    "migration/java/redisson/command-comparison-chart",
                  ],
                },
              ],
            },
            {
              label: "Node.js",
              items: [
                "migration/nodejs",
                {
                  label: "From ioredis",
                  items: [
                    "migration/nodejs/ioredis",
                    "migration/nodejs/ioredis/installation",
                    "migration/nodejs/ioredis/connection-setup",
                    "migration/nodejs/ioredis/command-comparison-ioredis-glide",
                    "migration/nodejs/ioredis/command-comparison-chart",
                  ],
                },
              ],
            },
            {
              label: "Go",
              items: [
                "migration/go",
                {
                  label: "From go-redis",
                  items: [
                    "migration/go/go-redis",
                    "migration/go/go-redis/installation",
                    "migration/go/go-redis/connection-setup",
                    "migration/go/go-redis/connection-management",
                    "migration/go/go-redis/error-handling",
                    "migration/go/go-redis/command-comparison-go-redis-glide",
                    "migration/go/go-redis/command-comparison-chart",
                  ],
                },
              ],
            },
            {
              label: "Python",
              items: [
                "migration/python",
                {
                  label: "From redis-py",
                  items: [
                    "migration/python/redis-py",
                    "migration/python/redis-py/command-comparison-redis-py-glide",
                    "migration/python/redis-py/command-comparison-chart",
                  ],
                },
              ],
            },
            {
              label: "PHP",
              items: [
                "migration/php",
                {
                  label: "From PHPRedis",
                  items: ["migration/php/phpredis"],
                },
              ],
            },
          ]),
        },
        {
          label: "Troubleshooting",
          slug: "troubleshooting",
        },
        {
          label: "Reference",
          collapsed: true,
          items: [
            "reference/access-control",
            "reference/scripting-reference",
            "reference/client-comparisons",
            "reference/valkey-commands-implementation-progress",
            "reference/connection-options",
            "reference/known-issues",
            {
              label: "API References",
              collapsed: true,
              items: [
                {
                  label: "Python",
                  link: "languages/python/api",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
                {
                  label: "Java",
                  link: "languages/java/api",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
                {
                  label: "Node.js",
                  link: "languages/nodejs/api",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
                {
                  label: "Go",
                  link: "https://pkg.go.dev/github.com/valkey-io/valkey-glide/go/v2",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
                // TODO: Remove "(Coming Soon)" when C# is GA (https://github.com/valkey-io/valkey-glide/issues/216)
                {
                  label: "C# (Coming Soon)",
                  link: "https://github.com/valkey-io/valkey-glide-csharp",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
                {
                  label: "PHP",
                  link: "https://github.com/valkey-io/valkey-glide-php/blob/main/valkey_glide.stub.php",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
              ],
            },
          ],
        },
        {
          label: "Feedback & Support",
          slug: "feedback-and-support",
        },
      ],
    }),
  ],
});
