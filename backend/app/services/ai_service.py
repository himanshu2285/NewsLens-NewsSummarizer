import os
from dotenv import load_dotenv
import anthropic
import json
import re

# Load environment variables
load_dotenv()

# Initialize Anthropic client
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY environment variable is not set")

client = anthropic.Anthropic(api_key=api_key)

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
    Calls Claude to summarize and classify the article.
    Returns {"summary": [...], "category": "..."}.
    """
    prompt = USER_PROMPT_TEMPLATE.format(
        categories=", ".join(CATEGORIES),
        article_text=text[:6000]
    )

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()

    # Strip accidental markdown fences
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        raise ValueError(f"AI returned invalid JSON: {raw[:300]}")

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
