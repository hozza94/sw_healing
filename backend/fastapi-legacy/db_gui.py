#!/usr/bin/env python3
"""
SQLite 데이터베이스 GUI 확인 도구
"""
import sqlite3
import os
from flask import Flask, render_template_string, request, jsonify

app = Flask(__name__)

# HTML 템플릿
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>SQLite 데이터베이스 확인</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background-color: #f8f9fa; }
        .container { max-width: 1400px; margin: 0 auto; }
        .table { margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .table-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; font-weight: bold; border-radius: 8px 8px 0 0; }
        .table-content { padding: 20px; background: white; border-radius: 0 0 8px 8px; }
        .query-form { margin: 20px 0; padding: 25px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .query-input { width: 100%; height: 120px; margin: 15px 0; padding: 15px; border: 2px solid #e9ecef; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 14px; resize: vertical; }
        .query-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
        .btn { padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s ease; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .result { margin: 20px 0; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .error { color: #dc3545; }
        .success { color: #28a745; }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
        .data-table th, .data-table td { border: 1px solid #dee2e6; padding: 12px 8px; text-align: left; vertical-align: top; }
        .data-table th { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); font-weight: bold; color: #495057; position: sticky; top: 0; z-index: 10; }
        .data-table tr:nth-child(even) { background-color: #f8f9fa; }
        .data-table tr:hover { background-color: #e3f2fd; transition: background-color 0.2s ease; }
        .data-table td { max-width: 200px; word-wrap: break-word; overflow-wrap: break-word; }
        .data-table td.long-text { max-width: 300px; }
        .message { padding: 15px; margin: 15px 0; border-radius: 5px; font-weight: 500; }
        .message.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .message.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .debug { background-color: #fff3cd; color: #856404; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px; font-size: 13px; }
        .debug strong { color: #856404; }
        .table-info { display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #667eea; }
        .table-info strong { color: #495057; }
        .table-info small { color: #6c757d; }
        .scroll-container { max-height: 600px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 5px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-card h3 { margin: 0 0 10px 0; color: #495057; font-size: 18px; }
        .stat-card p { margin: 0; font-size: 24px; font-weight: bold; color: #667eea; }
        h1 { color: #495057; text-align: center; margin-bottom: 30px; }
        h3 { color: #495057; margin-bottom: 15px; }
        h4 { color: #6c757d; margin: 15px 0 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 SQLite 데이터베이스 확인 도구</h1>
        
        <div class="query-form">
            <h3>SQL 쿼리 실행</h3>
            <form method="POST">
                <textarea name="query" class="query-input" placeholder="SELECT * FROM users LIMIT 5;">{{ query or '' }}</textarea>
                <br>
                <button type="submit" class="btn">쿼리 실행</button>
            </form>
        </div>

        {% if result %}
        <div class="result">
            <h3>실행 결과:</h3>
            
            <!-- 디버깅 정보 -->
            <div class="debug">
                <strong>디버깅 정보:</strong><br>
                Result keys: {{ result.keys() | list }}<br>
                Has error: {{ result.get('error') is not none }}<br>
                Has columns: {{ result.get('columns') is not none }}<br>
                Has rows: {{ result.get('rows') is not none }}<br>
                Rows count: {{ result.get('rows') | length if result.get('rows') else 0 }}
            </div>
            
            {% if result.get('error') %}
                <div class="message error">{{ result.get('error') }}</div>
            {% else %}
                <div class="message success">쿼리 실행 성공!</div>
                {% if result.get('message') %}
                    <div class="message success">{{ result.get('message') }}</div>
                {% endif %}
                {% if result.get('columns') and result.get('rows') %}
                    <h4>컬럼: {{ result.get('columns') | join(', ') }}</h4>
                    <h4>데이터 ({{ result.get('rows') | length }}개):</h4>
                    <div class="scroll-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    {% for col in result.get('columns') %}
                                        <th>{{ col }}</th>
                                    {% endfor %}
                                </tr>
                            </thead>
                            <tbody>
                                {% for row in result.get('rows') %}
                                    <tr>
                                        {% for cell in row %}
                                            <td class="{{ 'long-text' if cell and cell is not none and cell|string|length > 50 else '' }}">{{ cell if cell is not none else '' }}</td>
                                        {% endfor %}
                                    </tr>
                                {% endfor %}
                            </tbody>
                        </table>
                    </div>
                {% endif %}
            {% endif %}
        </div>
        {% endif %}

        <div class="stats">
            <div class="stat-card">
                <h3>📁 데이터베이스 경로</h3>
                <p style="font-size: 14px; word-break: break-all;">{{ db_path }}</p>
            </div>
            <div class="stat-card">
                <h3>📊 파일 크기</h3>
                <p>{{ file_size }} bytes</p>
            </div>
            <div class="stat-card">
                <h3>📋 테이블 개수</h3>
                <p>{{ table_count }}개</p>
            </div>
        </div>

        <div class="table">
            <div class="table-header">📊 테이블 목록</div>
            <div class="table-content">
                {% for table in tables %}
                    <div class="table-info">
                        <div>
                            <strong>{{ table.name }}</strong> ({{ table.count }}개 데이터)
                            <br>
                            <small>컬럼: {{ table.columns | join(', ') }}</small>
                        </div>
                    </div>
                {% endfor %}
            </div>
        </div>
    </div>
</body>
</html>
"""

def get_db_info():
    """데이터베이스 정보 가져오기"""
    db_path = "suwon_healing.db"
    
    if not os.path.exists(db_path):
        return None
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 테이블 목록
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    table_info = []
    for table in tables:
        table_name = table[0]
        
        # 컬럼 정보
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = [col[1] for col in cursor.fetchall()]
        
        # 데이터 개수
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        count = cursor.fetchone()[0]
        
        table_info.append({
            'name': table_name,
            'columns': columns,
            'count': count
        })
    
    conn.close()
    
    return {
        'db_path': os.path.abspath(db_path),
        'file_size': os.path.getsize(db_path),
        'table_count': len(tables),
        'tables': table_info
    }

@app.route('/', methods=['GET', 'POST'])
def index():
    db_info = get_db_info()
    
    if request.method == 'POST':
        query = request.form.get('query', '').strip()
        result = {'query': query}
        
        if query:
            try:
                conn = sqlite3.connect("suwon_healing.db")
                cursor = conn.cursor()
                cursor.execute(query)
                
                if query.upper().startswith('SELECT'):
                    rows = cursor.fetchall()
                    columns = [description[0] for description in cursor.description]
                    result.update({
                        'columns': columns,
                        'rows': rows,
                        'error': None
                    })
                    print(f"DEBUG: SELECT 쿼리 실행 - 컬럼: {columns}, 행 수: {len(rows)}")
                else:
                    conn.commit()
                    result.update({
                        'message': f'쿼리 실행 완료: {cursor.rowcount}개 행이 영향받음',
                        'error': None
                    })
                    print(f"DEBUG: UPDATE/INSERT 쿼리 실행 - 영향받은 행: {cursor.rowcount}")
                
                conn.close()
                
            except Exception as e:
                result['error'] = str(e)
                print(f"DEBUG: 쿼리 실행 오류 - {e}")
        else:
            result = None
    else:
        result = None
    
    # 디버깅 정보 출력
    if result:
        print(f"DEBUG: result = {result}")
    
    return render_template_string(HTML_TEMPLATE, 
                                db_info=db_info, 
                                result=result,
                                query=result['query'] if result else '',
                                db_path=db_info['db_path'] if db_info else '',
                                file_size=db_info['file_size'] if db_info else 0,
                                table_count=db_info['table_count'] if db_info else 0,
                                tables=db_info['tables'] if db_info else [])

if __name__ == '__main__':
    print("🌐 SQLite 데이터베이스 GUI 도구 시작...")
    print("📱 브라우저에서 http://localhost:5000 접속")
    app.run(debug=True, port=5000) 