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
              autogenerate: { directory: "concepts/comparison" },
            },
            {
              label: "Limitations",
              autogenerate: { directory: "concepts/limitations" },
            },
            {
              label: "Valkey Integrations",
              autogenerate: { directory: "concepts/valkey-integrations" },
            },
          ],
        },
        {
          label: "How-To Guides",
          collapsed: false,
          autogenerate: { directory: "how-to" },
        },
        {
          label: "Languages",
          collapsed: false,
          autogenerate: { directory: "languages" },
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
