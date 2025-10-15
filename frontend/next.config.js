/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages용 정적 빌드 설정
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  
  // 환경 변수 설정
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || '수원 힐링 상담센터'
  }
};

module.exports = nextConfig; 