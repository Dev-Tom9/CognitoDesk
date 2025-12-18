import os
from dotenv import load_dotenv

# --- IMPORTS ---
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
# Using FakeEmbeddings to bypass OpenAI quota issues during testing
from langchain_community.embeddings import FakeEmbeddings 
from langchain_core.documents import Document 

# Ensure environment variables are loaded
load_dotenv()

# --- Configuration ---
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")

class KnowledgeProcessor:
    """
    Manages the Knowledge Ingestion and Retrieval (RAG) pipeline using Fake Embeddings.
    """
    
    def __init__(self):
        print(f"Initializing KnowledgeProcessor (OFFLINE MODE). Path: {CHROMA_DB_PATH}")

        # 1. Text Splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

        # 2. Fake Embedding Model (Size 1536 matches OpenAI standards)
        self.embeddings = FakeEmbeddings(size=1536)

        # 3. Vector Store
        self.vectorstore = Chroma(
            collection_name="cognito_desk_knowledge",
            embedding_function=self.embeddings,
            persist_directory=CHROMA_DB_PATH
        )
        print("KnowledgeProcessor initialization complete.")

    def ingest_knowledge_article(self, article_id: str, title: str, content: str):
        """Processes and stores an article in the vector database."""
        try:
            document = [
                Document(
                    page_content=content,
                    metadata={"source": "api_ingestion", "article_id": article_id, "title": title}
                )
            ]

            chunks = self.text_splitter.split_documents(document)
            self.vectorstore.add_documents(chunks)
            
            print(f"✅ Ingested '{title}' with {len(chunks)} chunks (Fake Embeddings).")
            return {"status": "success", "article_id": article_id, "chunks_count": len(chunks)}
        except Exception as e:
            print(f"❌ Ingestion Error: {e}")
            return {"status": "error", "message": str(e)}

    def search_knowledge(self, query: str, k: int = 3):
        """Searches the vector database for relevant chunks."""
        try:
            # FakeEmbeddings are deterministic, so 'search' matches 'ingest'
            docs = self.vectorstore.similarity_search(query, k=k)
            
            formatted_results = [
                {"content": doc.page_content, "metadata": doc.metadata}
                for doc in docs
            ]
            
            print(f"🔍 Search for '{query}' found {len(formatted_results)} matches.")
            return formatted_results
        except Exception as e:
            print(f"❌ Search Error: {e}")
            return []

# Single instance for the application
knowledge_processor = KnowledgeProcessor()