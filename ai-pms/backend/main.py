from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dtypes import AnalysisRequest, TaskExtractionResponse
from llm_engine import analyze_transcript
import uvicorn

app = FastAPI(title="AI-PMS Intelligent Context-Aware Task Orchestrator")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze", response_model=TaskExtractionResponse)
async def analyze(request: AnalysisRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Transcript text cannot be empty")
    
    result = analyze_transcript(request.text)
    return result

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
