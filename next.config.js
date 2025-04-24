/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    transpilePackages: ['@floating-ui/react-dom'],
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@floating-ui/react-dom': '@floating-ui/react-dom/dist/floating-ui.react-dom.esm.js'
        };
        return config;
    }
}

module.exports = nextConfig