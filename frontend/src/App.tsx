import React from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>수원 힐링 상담센터</h1>
        <p>Suwon Healing Counseling Center</p>
        <div className="status">
          <p>🚀 개발 환경이 성공적으로 실행되었습니다!</p>
          <p>✅ 백엔드 API: <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer">http://localhost:8000</a></p>
          <p>📚 API 문서: <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">http://localhost:8000/docs</a></p>
        </div>
      </header>
    </div>
  )
}

export default App 