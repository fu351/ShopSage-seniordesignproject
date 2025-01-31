/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // Enables static site export (required for GitHub Pages)
    distDir: "out",   // Ensures build output is in 'out' (GitHub Pages requires this)
};

export default nextConfig;
