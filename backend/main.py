from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.knowledge_processor import knowledge_processor 

app = FastAPI(
    title="CognitoDesk Backend API",
    description="API for Knowledge Ingestion and Search.",
    version="1.0.0",
)

# CORS: Configured for GitHub Codespaces Public Port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to CognitoDesk Backend API"}

# --- INGESTION ENDPOINT ---
@app.post("/api/v1/knowledge/ingest")
async def ingest_knowledge(data: dict):
    article_id = data.get("article_id")
    title = data.get("title")
    content = data.get("content")
    
    if not article_id or not title or not content:
        return {"message": "Missing article_id, title, or content.", "success": False}

    try:
        result = knowledge_processor.ingest_knowledge_article(article_id, title, content)
        if result.get("status") == "success":
            return {
                "message": "Article ingestion successful.",
                "success": True,
                "data": {"chunks_processed": result['chunks_count']}
            }
        else:
            raise Exception(result.get("message"))
    except Exception as e:
        print(f"❌ Ingestion Error: {e}")
        return {"message": f"Internal server error: {str(e)}", "success": False}

# --- QUERY ENDPOINT ---
@app.post("/api/v1/knowledge/query")
async def query_knowledge(data: dict):
    query_text = data.get("query")
    
    if not query_text:
        return {"message": "No query provided.", "success": False}

    try:
        results = knowledge_processor.search_knowledge(query_text)
        return {
            "success": True,
            "query": query_text,
            "results": results
        }
    except Exception as e:
        print(f"❌ Query Error: {e}")
        return {"message": f"Search failed: {str(e)}", "success": False}