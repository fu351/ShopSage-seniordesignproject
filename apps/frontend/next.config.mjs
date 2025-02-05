/** @type {import('next').NextConfig} */
const nextConfig = {
    // Github Pages Setup
    // output: "export", // Enables static site export (required for GitHub Pages)
    output: "standalone",
    distDir: "out"   // Ensures build output is in 'out' (GitHub Pages requires this)
};

export default nextConfig;
