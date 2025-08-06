import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              수원 힐링 상담센터
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              소개
            </Link>
            <Link href="/consultation" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              상담 신청
            </Link>
            <Link href="/counselors" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              상담사
            </Link>
            <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              후기
            </Link>
            <Link href="/notices" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              공지사항
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Link href="/auth/login">로그인</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/register">회원가입</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
} 