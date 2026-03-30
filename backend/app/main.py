import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import summarize, history, auth
from app.utils.database import Base, engine

# Load environment variables first
load_dotenv()

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI News Summarizer API",
    description="Summarize news articles using Claude AI",
    version="1.0.0"
)

# CORS - allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(summarize.router, tags=["Summarize"])
app.include_router(history.router, tags=["History"])


@app.get("/")
def root():
    return {"message": "AI News Summarizer API is running 🚀"}
