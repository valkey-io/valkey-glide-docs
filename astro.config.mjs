// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";

// https://astro.build/config
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
      title: "Valkey Glide",
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
      sidebar: [
        "overview",
        {
          label: "Getting Started",
          items: [
            "getting-started/quickstart",
            "getting-started/specifying-options",
            "getting-started/basic-operations",
            {
              label: "Tutorials",
              collapsed: true,
              autogenerate: {
                directory: "getting-started/tutorials",
              },
            },
          ],
        },
        {
          label: "Concepts",
          collapsed: false,
          items: [
            {
              label: "Architecture",
              autogenerate: { directory: "concepts/architecture" },
            },
            {
              label: "Client Features",
              autogenerate: { directory: "concepts/client-features" },
            },
            {
              label: "Comparison",
              collapsed: true,
              autogenerate: { directory: "concepts/comparison" },
            },
            {
              label: "Limitations",
              collapsed: true,
              autogenerate: { directory: "concepts/limitations" },
            },
            {
              label: "Valkey Integrations",
              collapsed: true,
              autogenerate: { directory: "concepts/valkey-integrations" },
            },
          ],
        },
        {
          label: "How-To Guides",
          collapsed: true,
          // autogenerate: { directory: "how-to" },
          items: [
            {
              label: "Cloud Development",
              autogenerate: { directory: "how-to/cloud-development" },
            },
            {
              label: "Connection Management",
              autogenerate: { directory: "how-to/connection-management" },
            },
            {
              label: "Framework Integration",
              autogenerate: { directory: "how-to/framework-integration" },
            },
            {
              label: "monitoring",
              autogenerate: { directory: "how-to/monitoring" },
            },
            {
              label: "operations",
              autogenerate: { directory: "how-to/operations" },
            },
            {
              label: "performance",
              autogenerate: { directory: "how-to/performance" },
            },
            {
              label: "security",
              autogenerate: { directory: "how-to/security" },
            },
          ],
        },
        {
          label: "Languages",
          collapsed: false,
          items: [
            {
              label: "Python",
              collapsed: true,
              items: [
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
                  autogenerate: { directory: "languages/python/migration" },
                },
                {
                  label: "Developer",
                  autogenerate: { directory: "languages/python/developer" },
                },
                {
                  label: "Reference",
                  autogenerate: { directory: "languages/python/reference" },
                },
              ],
            },
            {
              label: "Java",
              collapsed: true,
              items: [
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
                  autogenerate: { directory: "languages/java/migration" },
                },
                {
                  label: "Developer",
                  autogenerate: { directory: "languages/java/developer" },
                },
                {
                  label: "Reference",
                  autogenerate: { directory: "languages/java/reference" },
                },
              ],
            },
          ],
        },
        {
          label: "Migration",
          collapsed: false,
          autogenerate: { directory: "migration" },
        },
        {
          label: "Reference",
          collapsed: false,
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
