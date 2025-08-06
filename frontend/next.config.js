/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Vercel 배포용 설정
  output: 'standalone',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  
  // GitHub Pages용 정적 내보내기 설정 (필요시 주석 해제)
  // output: 'export',
  // trailingSlash: true,
  // images: {
  //   unoptimized: true
  // }
};

module.exports = nextConfig; 