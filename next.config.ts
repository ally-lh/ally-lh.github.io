import type { NextConfig } from "next";

/**
 * The site is published to GitHub Pages (https://ally-lh.github.io), a static
 * host, so the app is built as a fully static export. Every page is rendered
 * at build time; the Contentful gallery is fetched once during `next build`.
 */
const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages has no image optimizer; serve images as-is.
  images: { unoptimized: true },
};

export default nextConfig;
