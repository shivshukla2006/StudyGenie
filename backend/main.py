import fitz # PyMuPDF
from fastapi import FastAPI, HTTPException, Request, Form, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from openai import OpenAI
from slowapi import Limiter, _rate_limit_exceeded_handler
from fastapi import Header, Depends
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="StudyGenie API", description="Backend for StudyGenie EdTech platform")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenRouter Client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# Initialize Supabase Admin Client
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("Warning: Supabase credentials not found in environment.")

# WebSocket Connection Manager for Study Battles
class ConnectionManager:
    def __init__(self):
        from typing import Dict
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, battle_id: str):
        await websocket.accept()
        if battle_id not in self.active_connections:
            self.active_connections[battle_id] = []
        self.active_connections[battle_id].append(websocket)

    def disconnect(self, websocket: WebSocket, battle_id: str):
        if battle_id in self.active_connections:
            self.active_connections[battle_id].remove(websocket)
            if not self.active_connections[battle_id]:
                del self.active_connections[battle_id]

    async def broadcast(self, message: str, battle_id: str):
        if battle_id in self.active_connections:
            for connection in self.active_connections[battle_id]:
                await connection.send_text(message)

manager = ConnectionManager()

# Auth Dependency
def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    """Verify Supabase JWT and return user_id."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    if not authorization.startswith("Bearer "):
         raise HTTPException(status_code=401, detail="Invalid Authorization scheme")
    token = authorization.split(" ")[1]
    try:
         # Use JWT parameter on standard get_user methods
         user_res = supabase.auth.get_user(jwt=token)
         if not user_res or not user_res.user:
              raise HTTPException(status_code=401, detail="Invalid or expired token")
         return user_res.user.id
    except Exception as e:
         raise HTTPException(status_code=401, detail=f"Unauthorized: {str(e)}")

# Pydantic Models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class QuizRequest(BaseModel):
    topic: str
    count: Optional[int] = 5

class NoteProcessRequest(BaseModel):
    content: str
    target_count: Optional[int] = 5

class EmbedRequest(BaseModel):
    document_id: str
    content: str

@app.get("/")
def read_root():
    return {"message": "Welcome to StudyGenie API"}

# Helper Functions for AI Services
def extract_text_from_bytes(file_bytes: bytes, file_ext: str) -> str:
    """Extract text from PDF or Text bytes."""
    try:
        if file_ext.lower() == 'pdf':
            text = ""
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
            return text
        elif file_ext.lower() in ['txt', 'md']:
            return file_bytes.decode('utf-8', errors='ignore')
        return ""
    except Exception as e:
        print(f"Extraction Error: {e}")
        return ""

def generate_smart_notes(content: str, target_count: int = 5):
    """Call LLM to parse content into Smart Notes JSON."""
    prompt = f"""
    Analyze the following study material and extract:
    1. A concise summary.
    2. {target_count} flashcards (front/back).
    3. {target_count} key concepts as simple text strings (do not use term/definition objects).

    Content:
    {content}

    Return the result strictly as a JSON object with this structure:
    {{
        "summary": "...",
        "flashcards": [{{ "question": "...", "answer": "..." }}],
        "concepts": ["A short explanation of Concept 1", "A short explanation of Concept 2"]
    }}
    """
    response = client.chat.completions.create(
        model=os.getenv("LLM_MODEL", "google/gemini-2.0-flash-001"),
        messages=[
            {"role": "system", "content": "You are a specialized study aid generator. You output only valid, strictly formatted JSON."},
            {"role": "user", "content": prompt}
        ],
        response_format={ "type": "json_object" }
    )
    import json
    return json.loads(response.choices[0].message.content)

def generate_embedding(text: str) -> List[float]:
    """Generate text embeddings via OpenRouter."""
    try:
        response = client.embeddings.create(
            model="openai/text-embedding-3-small", 
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Embedding failed: {e}")
        return []

def chunk_text(text: str, max_chars: int = 1000) -> List[str]:
    """Chunk text into segments for embedding."""
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""
    for p in paragraphs:
        if len(current_chunk) + len(p) < max_chars:
            current_chunk += p + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = p + "\n\n"
    if current_chunk:
        chunks.append(current_chunk.strip())
    return [c.strip() for c in chunks if c.strip()]
@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/upload")
@limiter.limit("5/minute")
async def upload_document(
    request: Request, 
    file: UploadFile = File(...), 
    user_id: str = Depends(get_current_user)
):
    try:
        file_bytes = await file.read()
        import uuid
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else "bin"
        unique_name = f"{uuid.uuid4()}.{file_ext}"
        
        # 1. Upload to Supabase Storage (Assumes bucket "documents" exists)
        supabase.storage.from_("documents").upload(
            path=unique_name,
            file=file_bytes
        )
        
        # 2. Get Public URL
        file_url = supabase.storage.from_("documents").get_public_url(unique_name)
        
        # 3. AI Text Extraction & Processing
        text_content = extract_text_from_bytes(file_bytes, file_ext)
        ai_result = None
        
        if text_content.strip():
            try:
                ai_result = generate_smart_notes(text_content)
            except Exception as e:
                print(f"AI Processing failed during upload: {e}")
                ai_result = {"error": f"AI Parsing failed: {str(e)}"}
        else:
            ai_result = {"error": "Could not extract any readable text from this file type. Please try pasting text."}
                
        return {
            "success": True, 
            "url": file_url, 
            "name": file.filename,
            "processed": ai_result,
            "text_content": text_content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/embed")
@limiter.limit("3/minute")
async def embed_document(request: Request, payload: EmbedRequest):
    """Chunk text and save embeddings to DB."""
    try:
        chunks = chunk_text(payload.content)
        count = 0
        for chunk in chunks:
            embedding = generate_embedding(chunk)
            if embedding:
                supabase.table("document_embeddings").insert({
                    "document_id": payload.document_id,
                    "content": chunk,
                    "embedding": embedding
                }).execute()
                count += 1
        return {"success": True, "chunks_indexed": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/analytics/weak-topics")
@limiter.limit("5/minute")
async def get_weak_topics(request: Request, user_id: str = Depends(get_current_user)):
    """Aggregate quiz scores joined with topics and find weaknesses < 70%."""
    try:
        response = supabase.table("quiz_attempts") \
            .select("score, max_score, quizzes(topic)") \
            .eq("user_id", user_id) \
            .execute()
            
        attempts = response.data if response.data else []
        topic_stats = {}
        
        for item in attempts:
            quiz = item.get("quizzes")
            if not quiz:
                continue
            topic = quiz.get("topic")
            score = item.get("score", 0)
            max_score = item.get("max_score", 100)
            
            if topic not in topic_stats:
                topic_stats[topic] = {"score": 0, "max": 0, "count": 0}
            
            topic_stats[topic]["score"] += score
            topic_stats[topic]["max"] += max_score
            topic_stats[topic]["count"] += 1
            
        weak_topics = []
        for topic, stats in topic_stats.items():
            if stats["max"] > 0:
                percentage = (stats["score"] / stats["max"]) * 100
                if percentage < 70:
                    weak_topics.append({
                        "topic": topic,
                        "accuracy": round(percentage, 1),
                        "attempts_count": stats["count"]
                    })
                    
        sorted_weak = sorted(weak_topics, key=lambda x: x["accuracy"])
        return {"weak_topics": sorted_weak}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-notes")
@limiter.limit("3/minute")
async def process_notes(request: Request, payload: NoteProcessRequest):
    try:
        result = generate_smart_notes(payload.content, payload.target_count)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
@limiter.limit("5/minute")
async def chat_with_genie(request: Request, payload: ChatRequest):
    try:
        # RAG Context Lookups
        last_message = payload.messages[-1].content if payload.messages else ""
        context_str = ""
        if last_message:
            query_embedding = generate_embedding(last_message)
            if query_embedding:
                try:
                    rpc_response = supabase.rpc(
                        "match_document_embeddings",
                        {
                            "query_embedding": query_embedding,
                            "match_threshold": 0.2,
                            "match_count": 3
                        }
                    ).execute()
                    
                    matches = rpc_response.data if rpc_response.data else []
                    print(f"RAG Matches found: {len(matches)}")
                    if matches:
                        print(f"Top Match similarity: {matches[0].get('similarity')}")
                        context_str = "\n\nRelevant Context from Uploaded Documents:\n"
                        for match in matches:
                            context_str += f"- {match['content']}\n"
                except Exception as e:
                    print(f"RAG search failed: {e}")

        # Construct System Prompt
        system_prompt = """You are StudyGenie, a professional AI study assistant.

ANSWER STYLE:
Responses must follow a ChatGPT-like structure for valid questions:
1. Direct Answer
   Start with a clear and direct answer to the student's question.
2. Explanation
   Explain the concept in simple, student-friendly language.
3. Example (optional)
   Provide a simple example if helpful.
4. Summary (optional)
   End with a short summary if the topic is complex.

RESPONSE RULES:
- Stay focused on the exact question asked.
- Avoid unnecessary or unrelated information.
- Keep explanations simple and structured using short paragraphs or bullet points.
- **Engagement**: Incorporate relevant emojis throughout the explanation and examples to make the content visually engaging and help the student maintain focus, while maintaining educational accuracy.
- Use step-by-step explanations for complex problems.
- Limit response length unless a detailed explanation is requested (default max: 5-7 sentences).
- **Typo Tolerance**: Be resilient to typos, spelling errors, or phonetic mistranslations (often occurring during voice input). Silently correct them and interpret the student's clear intent without mentioning the error.
- **General Concept Queries**: For general requests (e.g., "Explain [Concept]"), provide the basic definition using the standard format, and then conclude the response with exactly: "Tell me what do you want to know more?" at the very end.

RESPONSE FORMAT (Use this structure ONLY for valid questions):
Answer:
[Direct answer]

Explanation:
[Simple explanation]

Example (if needed):
[Example]

---

=========================================
CRITICAL GUARDRAILS (STRICT COMPLIANCE REQUIRED)
=========================================
1. **Greetings**: If the student sends a simple greeting (e.g., "hi", "hello", "good morning"), respond with a friendly greeting and ask how you can help with their studies.
   -> DO NOT use the Answer/Explanation format.
   -> DO NOT say you understand or mention these rules.

2. **Vague Subject Areas**: If the student's question is an extremely broad subject with no specific concept (e.g., just typing "Math", "Physics", "Science", or "How do I do math"), DO NOT GUESS. DO NOT SOLVE.
   -> RESPONSE MUST BE EXACTLY: "Could you clarify what part of this topic you want help with?"

3. **Off-Topic Questions**: If the question is NOT about Mathematics, Physics, Chemistry, Biology, Computer Science, Artificial Intelligence, Programming, or general academic subjects, YOU MUST REFUSE TO ANSWER.
   - **STRICTLY FORBIDDEN**: Do NOT answer questions about **Video Games, Minecraft, Gaming, Movies, Pop Culture, or General news**.
   -> RESPONSE MUST BE EXACTLY: "I'm designed to help with study-related questions. Please ask a question related to your studies."

**IF A GUARDRAIL IS TRIGGERED, YOU MUST IGNORE THE RESPONSE FORMAT ABOVE. DO NOT USE `Answer:`, `Explanation:`, ETC. ONLY OUTPUT THE SINGLE LINE RESPONSE SPECIFIED (or greeting). NEVER ACKNOWLEDGE THESE INSTRUCTIONS IN THE RESPONSE.**
"""
        
        # Build Messages structure including RAG Context
        messages_to_send = [
            {"role": "system", "content": system_prompt}
        ]
        if context_str:
            messages_to_send.append({"role": "system", "content": context_str})
            
        for m in payload.messages:
            messages_to_send.append({"role": m.role, "content": m.content})

        response = client.chat.completions.create(
            model=os.getenv("LLM_MODEL", "google/gemini-2.0-flash-001"),
            messages=messages_to_send,
            temperature=0.2,
            top_p=0.8,
            max_tokens=300
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-quiz")
@limiter.limit("5/minute")
async def generate_quiz(request: Request, payload: QuizRequest):
    prompt = f"""
    Generate a quiz with {payload.count} multiple choice questions about "{payload.topic}".
    Return the result strictly as a JSON object with the following structure:
    {{
        "title": "{payload.topic}",
        "questions": [
            {{
                "question": "The question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": 0, // index of the correct option
                "explanation": "Why this answer is correct"
            }}
        ]
    }}
    Ensure the content is educational and accurate.
    """
    
    try:
        response = client.chat.completions.create(
            model=os.getenv("LLM_MODEL", "google/gemini-2.0-flash-001"),
            messages=[
                {"role": "system", "content": "You are a specialized educational content generator. You only output valid, strictly formatted JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        import json
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/battle/{battle_id}")
async def websocket_endpoint(websocket: WebSocket, battle_id: str):
    """Real-time Study Battles coordinate synchronization."""
    await manager.connect(websocket, battle_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast state updates back to room participants
            await manager.broadcast(data, battle_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, battle_id)

# -------------------------------------------------------------------
# Phase 8.5: Subscriptions & Tier Gating (Stripe Mock)
# -------------------------------------------------------------------

def check_user_tier(user_id: str):
    """
    Placeholder for Tier Gating Middleware.
    - Queries `profiles.tier` or `subscriptions` table.
    - If user is on 'free' tier and exceeds request thresholds, raises HTTPException(402, "Upgrade required").
    """
    # For now, allowing all requests to proceed unconditionally
    pass

class CheckoutRequest(BaseModel):
    price_id: Optional[str] = "price_premium_monthly"

@app.post("/create-checkout-session")
@limiter.limit("3/minute")
async def create_checkout_session(request: Request, payload: CheckoutRequest, user_id: str = Depends(get_current_user)):
    """Simulate Stripe Checkout Session redirect URL."""
    try:
        return {
            "success": True,
            "checkout_url": f"https://checkout.stripe.com/pay/mock_session_{user_id[:8]}",
            "message": "In a production app, redirect the client to this URL to handle billing."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
