import os
from dotenv import load_dotenv
import ollama
import json
import re

# Load environment variables
load_dotenv()

# Initialize Ollama client with API key authentication
ollama_base_host = os.getenv("OLLAMA_HOST", "https://api.ollama.ai")
ollama_api_key = os.getenv("OLLAMA_API_KEY")
model = os.getenv("OLLAMA_MODEL", "llama2")

if not ollama_api_key:
    raise ValueError("OLLAMA_API_KEY environment variable is not set")

# Include API key in the host URL for authentication
# Format: https://api-key@host
if "://" in ollama_base_host:
    protocol, rest = ollama_base_host.split("://", 1)
    ollama_host = f"{protocol}://{ollama_api_key}@{rest}"
else:
    ollama_host = ollama_base_host

# Create Ollama client with remote host
client = ollama.Client(host=ollama_host)

CATEGORIES = ["Tech", "Sports", "Business", "Health", "Politics", "Science", "Entertainment", "World", "Other"]

SYSTEM_PROMPT = """You are an expert news analyst. Your job is to:
1. Summarize news articles clearly and concisely in exactly 5 bullet points.
2. Classify the article into exactly ONE category.

Always respond with valid JSON only — no markdown fences, no extra text.
"""

USER_PROMPT_TEMPLATE = """Summarize and classify the following news article.

Respond ONLY with this exact JSON format:
{{
  "summary": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
  "category": "ONE OF: {categories}"
}}

Article:
{article_text}
"""


def summarize_and_classify(text: str) -> dict:
    """
    Calls Ollama to summarize and classify the article.
    Returns {"summary": [...], "category": "..."}.
    """
    prompt = USER_PROMPT_TEMPLATE.format(
        categories=", ".join(CATEGORIES),
        article_text=text[:6000]
    )

    # Construct the full prompt with system message
    full_prompt = f"{SYSTEM_PROMPT}\n\n{prompt}"

    try:
        response = client.generate(
            model=model,
            prompt=full_prompt,
            stream=False
        )
        raw = response.get("response", "").strip()
    except Exception as e:
        raise ValueError(f"Ollama API error: {str(e)}")

    # Strip accidental markdown fences
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON. Error: {str(e)}. Raw response: {raw[:500]}")

    # Validate structure
    if not isinstance(result.get("summary"), list) or not result.get("category"):
        raise ValueError("AI response missing 'summary' list or 'category'.")

    # Ensure category is from our list
    cat = result["category"].strip()
    if cat not in CATEGORIES:
        cat = "Other"

    return {
        "summary": result["summary"][:5],
        "category": cat
    }
