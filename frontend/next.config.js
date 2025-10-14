/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages용 정적 빌드 설정
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  
  // 동적 라우트를 정적 빌드에서 제외
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/admin': { page: '/admin' },
      '/admin/consultations': { page: '/admin/consultations' },
      '/consultation': { page: '/consultation' },
      '/consultation/success': { page: '/consultation/success' },
      '/counselors': { page: '/counselors' },
      '/notices': { page: '/notices' },
      '/reviews': { page: '/reviews' },
    }
  },
  
  // 환경 변수 설정
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://sw-healing-api.hozza94.workers.dev',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || '수원 힐링 상담센터'
  }
};

module.exports = nextConfig; 