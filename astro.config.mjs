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

export default defineConfig({
  site: "https://glide.valkey.io",
  integrations: [
    mermaid({
      theme: "default",
      autoTheme: true,
    }),
    starlight({
      title: "Valkey Glide",
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
        "whats-new",
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
            {
              label: "Architecture",
              collapsed: true,
              autogenerate: { directory: "concepts/architecture" },
            },
            {
              label: "Client Features",
              collapsed: true,
              autogenerate: { directory: "concepts/client-features" },
            },
          ],
        },
        {
          label: "How-To Guides",
          collapsed: true,
          items: [
            "how-to/installation",
            "how-to/monitoring/logging",
            "how-to/synchronous-client",
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
                  label: "Configuration API Reference",
                  link: "https://pkg.go.dev/github.com/valkey-io/valkey-glide/go/v2/config",
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
