// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";

function collapsed(isCollapsed = false, sidebarItems) {
  return sidebarItems.map(item => {

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
  site: "https://valkey.io",
  base: "/valkey-glide-docs",
  integrations: [
    mermaid({
      theme: "default",
      autoTheme: true,
    }),
    starlight({
      components: {
        Header: "./src/components/Header.astro",
        MobileMenuToggle: "./src/components/MobileMenuToggle.astro",
      },
      title: "Valkey GLIDE",
      logo: {
        src: "./src/assets/valkey-logo.svg",
      },
      customCss: [
        // Relative path to your custom CSS file
        "./src/styles/custom.css",
      ],
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
      sidebar: collapsed(true, [
        "overview",
        "whats-new",
        {
          label: "Learn",
          items: [    
             "getting-started/quickstart",
             "getting-started/specifying-options",
             "getting-started/basic-operations",
             {
              label: "Tutorials",
              autogenerate: {
                directory: "getting-started/tutorials",
              },
             },
              {
                label: "Concepts",
                autogenerate: { directory: "concepts" },  
              },
              {
                label: "How-To Guides",
                autogenerate: { directory: "how-to" },
              },
          ]
        },
        {
          label: "Languages",
          collapsed: false,
          items: [
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
                {
                  label: "Concepts",
                  autogenerate: { directory: "languages/python/concepts" },
                },
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
                    "languages/python/migration",
                    {
                      label: "From redis-py",
                      autogenerate: {directory: "languages/python/migration/redis-py"}
                    },
                  ]
                },
                {
                  label: "Contributing",
                  autogenerate: { directory: "languages/python/developer" },
                },
                {
                  label:"API", link:'languages/python/api', attrs: { style: 'font-style: italic', target: '_blank'}
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
                {
                  label: "Concepts",
                  autogenerate: { directory: "languages/java/concepts" },
                },
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
                      autogenerate: {directory: "languages/java/migration/jedis"}
                    },
                    {
                      label: "From Lettuce",
                      autogenerate: {directory: "languages/java/migration/lettuce"}
                    },
                    {
                      label: "From Redisson",
                      autogenerate: {directory: "languages/java/migration/redisson"}
                    }
                  ]
                },
                {
                  label: "Contributing",
                  autogenerate: { directory: "languages/java/developer" },
                },
                {
                  label:"API Reference", link:'languages/java/api', attrs: { style: 'font-style: italic', target: '_blank'}
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
                {
                  label: "Concepts",
                  autogenerate: { directory: "languages/nodejs/concepts" },
                },
                {
                  label: "How-to",
                  autogenerate: { directory: "languages/nodejs/how-to" },
                },
                {
                  label: "Valkey Commands",
                  autogenerate: { directory: "languages/nodejs/valkey-commands" },
                },
                {
                  label: "Migration",
                  items: [
                    "languages/nodejs/migration",
                    {
                      label: "From ioredis",
                      autogenerate: {directory: "languages/nodejs/migration/ioredis"}
                    },
                  ]
                },
                {
                  label: "Contributing",
                  autogenerate: { directory: "languages/nodejs/developer" },
                },
                {
                  label:"API Reference", link:'languages/nodejs/api', attrs: { style: 'font-style: italic', target: '_blank'}
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
                {
                  label: "Concepts",
                  autogenerate: { directory: "languages/go/concepts" },
                },
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
                    "languages/go/migration",
                    {
                      label: "From go-redis",
                      
                      autogenerate: {directory: "languages/go/migration/go-redis"}
                    },
                  ]
                },
                {
                  label: "Contributing",
                  autogenerate: { directory: "languages/go/developer" },
                },
                {
                  label:"API Reference", link:'https://www.google.ca', attrs: { style: 'font-style: italic', target: '_blank'}
                },
              ],
            },
            {
              label: "C#",
              autogenerate: {directory: "languages/csharp"}
            },
            {
              label: "Php",
              autogenerate: {directory: "languages/php"}
            }
          ],
        },
        {
          label: "Migration",
          items: [
           "migration",
           {
            label: "Planning",
            autogenerate: {directory: "migration/planning"}
           }
          ]
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ]),
    }),
  ],
});
