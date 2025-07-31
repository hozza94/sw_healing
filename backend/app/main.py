from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(
    title="Suwon Healing Counseling Center API",
    description="수원 힐링 상담센터 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Suwon Healing Counseling Center API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "suwon-healing-api"}

@app.get("/api/v1")
async def api_info():
    return {
        "name": "Suwon Healing Counseling Center API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    } 