/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
eslint: {
    ignoreDuringBuilds: true,
},
    experimental: {
        workerThreads: false,
        cpus: 4,
    }
};

export default nextConfig;
