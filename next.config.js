/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  },
  images: {
    domains: ["imagedelivery.net"],
  },
};

module.exports = nextConfig;
