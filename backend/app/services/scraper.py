import httpx
from bs4 import BeautifulSoup
import re


def scrape_article(url: str) -> str:
    """
    Fetches a URL and extracts the main article text.
    Returns cleaned text or raises ValueError.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    try:
        response = httpx.get(url, headers=headers, follow_redirects=True, timeout=15)
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise ValueError(f"Failed to fetch URL: HTTP {e.response.status_code}")
    except httpx.RequestError as e:
        raise ValueError(f"Network error while fetching URL: {str(e)}")

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove noise tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form", "iframe"]):
        tag.decompose()

    # Try article/main content containers first
    article = (
        soup.find("article")
        or soup.find("main")
        or soup.find("div", class_=re.compile(r"article|content|post|story", re.I))
        or soup.find("body")
    )

    if not article:
        raise ValueError("Could not extract article content from the page.")

    text = article.get_text(separator="\n")
    # Clean whitespace
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    cleaned = "\n".join(lines)

    if len(cleaned) < 100:
        raise ValueError("Extracted text is too short — the page may require JavaScript.")

    return cleaned[:8000]  # cap at 8k chars to stay within token limits
