# 📰 NewsLens — AI News Summarizer

A full-stack web app that summarizes any news article (text or URL) into 5 bullet points and classifies it into a category

---

## ✨ Features

- **Paste text or URL** — scrapes the article automatically from a URL
- **5-bullet AI summary** — concise, readable output via Claude
- **Category classification** — Tech, Sports, Business, Health, Politics, Science, Entertainment, World, Other
- **History dashboard** — browse and filter past summaries
- **Auth system** — JWT-based register/login
- **Copy to clipboard** — one-click copy of any summary
- **Dark, minimal UI** — built with React + inline styles

---

## 🗂 Project Structure

```
news-summarizer/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── routes/
│   │   │   ├── summarize.py     # POST /summarize
│   │   │   ├── history.py       # GET /history, DELETE /history/:id
│   │   │   └── auth.py          # POST /auth/register, /auth/login
│   │   ├── services/
│   │   │   ├── ai_service.py    # Claude API integration
│   │   │   └── scraper.py       # URL → article text
│   │   ├── models/
│   │   │   └── models.py        # SQLAlchemy: User, Summary
│   │   └── utils/
│   │       ├── database.py      # DB engine + session
│   │       └── auth.py          # JWT + password hashing
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Root + page router
    │   ├── main.jsx             # React DOM entry
    │   ├── index.css            # Global styles + animations
    │   ├── components/
    │   │   ├── Navbar.jsx       # Top nav with auth state
    │   │   ├── SummaryCard.jsx  # Result display card
    │   │   └── CategoryBadge.jsx# Colored category pill
    │   ├── pages/
    │   │   ├── Home.jsx         # Summarizer UI
    │   │   ├── History.jsx      # Past summaries
    │   │   └── Auth.jsx         # Login / Register
    │   ├── services/
    │   │   └── api.js           # Axios API wrapper
    │   └── hooks/
    │       └── useAuth.jsx      # Auth context + provider
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── Dockerfile
```

---

## 🚀 Quick Start (Local)

### 1. Backend Setup

```bash
cd backend

# Copy and fill in env vars
cp .env.example .env
# Edit .env: add your ANTHROPIC_API_KEY

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

Backend will be live at: `http://localhost:8000`
Interactive API docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend will be live at: `http://localhost:3000`

---

## 🐳 Docker (Full Stack)

```bash
# From project root
cp backend/.env.example backend/.env
# Edit backend/.env with your ANTHROPIC_API_KEY

docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | ✅ |
| `SECRET_KEY` | JWT signing secret (change in prod) | ✅ |
| `DATABASE_URL` | SQLite (default) or PostgreSQL URL | Optional |

---

## 📡 API Reference

### `POST /summarize`

**Request:**
```json
{ "text": "article content here..." }
// OR
{ "url": "https://example.com/article" }
```

**Response:**
```json
{
  "id": 1,
  "summary": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "category": "Tech",
  "input_type": "text"
}
```

### `GET /history`

Query params: `?category=Tech&skip=0&limit=20`

### `DELETE /history/{id}`

### `POST /auth/register`

```json
{ "email": "you@example.com", "username": "yourname", "password": "secret" }
```

### `POST /auth/login`

Form data: `username`, `password`

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel (`npm run build` → deploy `dist/`) |
| Backend | Render (set env vars in dashboard) |
| Database | Supabase (PostgreSQL) or Render Postgres |

For production, set `DATABASE_URL` to your PostgreSQL connection string and update CORS origins in `backend/app/main.py`.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Axios |
| Backend | FastAPI, Uvicorn |
| AI | Anthropic Claude (claude-sonnet) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (python-jose) + bcrypt |
| Scraping | httpx + BeautifulSoup4 |
