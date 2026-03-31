import os
from dotenv import load_dotenv
import json
import re
import httpx


load_dotenv()

# Initialize Ollama client with API key authentication
ollama_host = os.getenv("OLLAMA_HOST", "https://ollama.com/api")
ollama_api_key = os.getenv("OLLAMA_API_KEY")
model = os.getenv("OLLAMA_MODEL", "gpt-oss:120b")

if not ollama_api_key:
    raise ValueError("OLLAMA_API_KEY environment variable is not set")


# Create HTTP client with Authorization header for cloud API
headers = {"Authorization": f"Bearer {ollama_api_key}"}
http_client = httpx.Client(headers=headers, timeout=120.0)

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

    # Make API call to Ollama cloud endpoint with Authorization header
    try:
        api_response = http_client.post(
            f"{ollama_host}/generate",
            json={
                "model": model,
                "prompt": full_prompt,
                "stream": False
            }
        )
        api_response.raise_for_status()
        response_data = api_response.json()
        raw = response_data.get("response", "").strip()
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
