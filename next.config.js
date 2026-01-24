/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      recharts: path.resolve(__dirname, 'components/recharts.js'),
    }
    return config
  },
}

module.exports = nextConfig
