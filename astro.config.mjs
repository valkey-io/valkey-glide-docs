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

const isDev = process.argv.includes('dev');
const googleTagManagerHeader = isDev ? [] : [
  {
    tag: /** @type {const} */ ('script'),
    content: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-5SQ3G3KB');`,
  },
];
const googleTagManagerBody = isDev ? {} : {
  SkipLink: './src/components/SkipLinkWithGTM.astro',
}

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
      components: {...googleTagManagerBody},
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
          slug: "overview"
        },
        {
          label: "What's New",
          slug: "releases"
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
              label: "Architecture",
              items: [
              "concepts/architecture/rust-core-design",
              "concepts/architecture/async-execution",
              ]
            },
            {
              label: "Commands API",
              items: [
                "commands/valkey-string"
              ]
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
                  slug: "tutorials/tls"
                },
                {
                  label: "Lua Scripting",
                  autogenerate: { directory: "tutorials/lua-scripting" },
                },
                {
                  label: "Pub/Sub",
                  autogenerate: { directory: "tutorials/pubsub" },
                }
              ]
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
            "how-to/operations/batch-transaction-and-pipelining",
            "how-to/synchronous-connection",
            {
              label: "Security",
              items: [
                "how-to/security/authentication",
                "how-to/security/dynamic-authentication",
                "how-to/security/tls",
                "how-to/security/access-control",
              {
                  label: "AWS Integrations",
                  items: [
                    {
                      label: "IAM Authentication with GLIDE",
                      slug: "how-to/security/iam-integration"
                    },
                    {
                      label: "IAM Authentication using AWS SDK",
                      slug: "how-to/security/iam-integration-using-aws-sdk"
                    },
                  ]
                },
              ]
            },
            {
              label: "Connections",
              items: [
                "how-to/connections/read-strategy",
                "how-to/connections/timeouts-and-reconnect-strategy"
              ]
            },
            {
              label: "Monitoring",
              items: [
                "how-to/monitoring/logging",
                "how-to/monitoring/open-telemetry",
                "how-to/monitoring/tracking-resources",
              ]
            }
          ]
        },
        {
          label: "Languages",
          items: collapsed(true, [
            {
              label: "Python",
              items: [
                "languages/python",
                {
                  label: "Getting Started",
                  autogenerate: {
                    directory: "languages/python/getting-started",
                  },
                },
                // {
                //   label: "Concepts",
                //   autogenerate: { directory: "languages/python/concepts" },
                // },
                {
                  label: "How-to",
                  autogenerate: { directory: "languages/python/how-to" },
                },
                {
                  label: "Valkey Commands",
                  autogenerate: {
                    directory: "languages/python/valkey-commands",
                  },
                },
                {
                  label: "Migration",
                  items: [
                    {
                      label: "From redis-py",
                      autogenerate: {
                        directory: "languages/python/migration/redis-py",
                      },
                    },
                  ],
                },
                {
                  label: "Contributing",
                  autogenerate: { directory: "languages/python/developer" },
                },
                {
                  label: "API Reference",
                  link: "languages/python/api",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
              ],
            },
            {
              label: "Java",
              items: [
                "languages/java",
                {
                  label: "Getting Started",
                  autogenerate: {
                    directory: "languages/java/getting-started",
                  },
                },
                // {
                //   label: "Concepts",
                //   autogenerate: { directory: "languages/java/concepts" },
                // },
                {
                  label: "How-to",
                  autogenerate: { directory: "languages/java/how-to" },
                },
                {
                  label: "Valkey Commands",
                  autogenerate: { directory: "languages/java/valkey-commands" },
                },
                {
                  label: "Migration",
                  items: [
                    "languages/java/migration",
                    {
                      label: "From Jedis",
                      autogenerate: {
                        directory: "languages/java/migration/jedis",
                      },
                    },
                    {
                      label: "From Lettuce",
                      autogenerate: {
                        directory: "languages/java/migration/lettuce",
                      },
                    },
                    {
                      label: "From Redisson",
                      autogenerate: {
                        directory: "languages/java/migration/redisson",
                      },
                    },
                  ],
                },
                {
                  label: "Contributing",
                  autogenerate: { directory: "languages/java/developer" },
                },
                {
                  label: "API Reference",
                  link: "languages/java/api",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
              ],
            },
            {
              label: "Node.js",
              items: [
                "languages/nodejs",
                {
                  label: "Getting Started",
                  autogenerate: {
                    directory: "languages/nodejs/getting-started",
                  },
                },
                // {
                //   label: "Concepts",
                //   autogenerate: { directory: "languages/nodejs/concepts" },
                // },
                {
                  label: "How-to",
                  autogenerate: { directory: "languages/nodejs/how-to" },
                },
                {
                  label: "Valkey Commands",
                  autogenerate: {
                    directory: "languages/nodejs/valkey-commands",
                  },
                },
                {
                  label: "Migration",
                  items: [
                    {
                      label: "From ioredis",
                      autogenerate: {
                        directory: "languages/nodejs/migration/ioredis",
                      },
                    },
                  ],
                },
                {
                  label: "Contributing",
                  autogenerate: { directory: "languages/nodejs/developer" },
                },
                {
                  label: "API Reference",
                  link: "languages/nodejs/api",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
              ],
            },
            {
              label: "Go",
              items: [
                "languages/go",
                {
                  label: "Getting Started",
                  autogenerate: {
                    directory: "languages/go/getting-started",
                  },
                },
                // {
                //   label: "Concepts",
                //   autogenerate: { directory: "languages/go/concepts" },
                // },
                {
                  label: "How-to",
                  autogenerate: { directory: "languages/go/how-to" },
                },
                {
                  label: "Valkey Commands",
                  autogenerate: { directory: "languages/go/valkey-commands" },
                },
                {
                  label: "Migration",
                  items: [
                    {
                      label: "From go-redis",
                      autogenerate: {
                        directory: "languages/go/migration/go-redis",
                      },
                    },
                  ],
                },
                {
                  label: "Contributing",
                  autogenerate: { directory: "languages/go/developer" },
                },
                {
                  label: "API Reference",
                  link: "https://pkg.go.dev/github.com/valkey-io/valkey-glide/go/v2",
                  attrs: { style: "font-style: italic", target: "_blank" },
                },
              ],
            },
          ]),
        },
        {
          label: "Migration",
          collapsed: true,
          items: [
            "migration",
            //  {
            //   label: "Planning",
            //   autogenerate: {directory: "migration/planning"}
            //  }
          ],
        },
        {
          label: "Troubleshooting",
          slug: "troubleshooting",
        },
        {
          label: "Reference",
          collapsed: true,
          autogenerate: { directory: "reference" },
        },
        {
          label: "Feedback & Support",
          slug: "feedback-and-support"
        },
      ],
    }),
  ],
});
