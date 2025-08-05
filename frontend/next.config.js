/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_KAKAO_MAPS_APP_KEY: process.env.NEXT_PUBLIC_KAKAO_MAPS_APP_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
  }
}

module.exports = nextConfig 