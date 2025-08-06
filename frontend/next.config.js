/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 배포용 설정
  output: 'standalone',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  
  // 환경 변수 설정 (필요시)
  env: {
    // 여기에 환경 변수 추가
  },
  
  // Vercel 배포를 위한 추가 설정
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig; 