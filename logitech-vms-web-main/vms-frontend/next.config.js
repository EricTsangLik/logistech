/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // env: {
    //   BASE_URL: process.env.BASE_URL,
    // },
    experimental: {
      appDir: true,
      serverComponentsExternalPackages: ["mongoose"],
    },
    // images: {
    //   domains: ['lh3.googleusercontent.com'],
    // },
    webpack(config) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      }
      return config
    },
    output: 'standalone',
  }
  
  
  module.exports = nextConfig
