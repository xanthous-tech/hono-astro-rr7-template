// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com", // required by sitemap
  srcDir: "./site",
  outDir: "./static",
  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
  },
  trailingSlash: "never",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react({
      experimentalReactChildren: true,
    }),
    starlight({
      title: "Product Documentation",
      sidebar: [
        // A group labelled “Documentation” containing links.
        {
          label: "Documentation",
          items: [
            // Using `slug` for internal links.
            { slug: "docs" },
            { slug: "docs/faq" },
            // // Or using the shorthand for internal links.
            // "tutorial",
            // "next-steps",
          ],
        },
        // A single link item labelled “API Reference”.
        // {
        //   label: "API Reference",
        //   link: "/api/v1/docs",
        // },
        {
          label: "Legal",
          items: [{ slug: "terms" }, { slug: "privacy" }],
        },
        // A group linking to all pages in the reference directory.
        // {
        //   label: "Reference",
        //   autogenerate: { directory: "docs/guides" },
        // },
      ],
    }),
    mdx(),
    sitemap(),
  ],
});
