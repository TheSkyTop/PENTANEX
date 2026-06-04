import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? process.env.NEXT_PUBLIC_BASE_PATH || "/EverstFoam" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  outputFileTracingRoot: __dirname,
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
