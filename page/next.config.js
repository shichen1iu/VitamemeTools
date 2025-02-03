/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@solana/wallet-adapter-react-ui"],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
