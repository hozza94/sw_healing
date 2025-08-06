import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">수원 힐링 상담센터</h3>
            <p className="text-gray-400 leading-relaxed">
              마음을 치유하는 따뜻한 공간
              전문 상담사와 함께 더 나은 내일을 만들어갑니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-blue-400">서비스</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/consultation" className="hover:text-blue-400 transition-colors duration-200">상담 신청</Link></li>
              <li><Link href="/counselors" className="hover:text-blue-400 transition-colors duration-200">상담사 소개</Link></li>
              <li><Link href="/reviews" className="hover:text-blue-400 transition-colors duration-200">후기</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-blue-400">고객지원</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/notices" className="hover:text-blue-400 transition-colors duration-200">공지사항</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors duration-200">센터 소개</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors duration-200">연락처</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-blue-400">연락처</h4>
            <div className="space-y-3 text-gray-400">
              <p className="flex items-center">
                <span className="mr-2">📞</span> 031-123-4567
              </p>
              <p className="flex items-center">
                <span className="mr-2">📧</span> info@suwon-healing.com
              </p>
              <p className="flex items-center">
                <span className="mr-2">📍</span> 수원시 팔달구 중부대로 123
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 수원 힐링 상담센터. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 