import { useState } from 'react'
import { summarizeText, summarizeUrl } from '../services/api'
import SummaryCard from '../components/SummaryCard'

export default function Home() {
  const [mode, setMode] = useState('text') // 'text' | 'url'
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!input.trim()) return
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const data = mode === 'url'
        ? await summarizeUrl(input.trim())
        : await summarizeText(input.trim())
      setResult(data)
    } catch (e) {
      const msg = e.response?.data?.detail || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700, color: '#e2e8f0',
          margin: '0 0 0.75rem',
          lineHeight: 1.2
        }}>
          Understand Any Article<br />
          <span style={{ background: 'linear-gradient(135deg, #6ee7f7, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            In Seconds
          </span>
        </h1>
        <p style={{
          color: '#64748b', fontFamily: "'DM Sans', sans-serif",
          fontSize: '1rem', margin: 0
        }}>
          Paste a news article or URL — get a clean summary + category, powered by NewsLens AI.
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{
        display: 'flex', gap: '0', marginBottom: '1.25rem',
        background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
        padding: '4px', border: '1px solid rgba(255,255,255,0.07)'
      }}>
        {['text', 'url'].map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(''); setResult(null); setError('') }} style={{
            flex: 1, padding: '0.5rem', border: 'none',
            borderRadius: '7px', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 500,
            background: mode === m ? 'rgba(110,231,247,0.12)' : 'transparent',
            color: mode === m ? '#6ee7f7' : '#64748b',
            transition: 'all 0.2s'
          }}>
            {m === 'text' ? '📝 Paste Text' : '🔗 Enter URL'}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        {mode === 'text' ? (
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your news article here... (Ctrl+Enter to summarize)"
            rows={8}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '1rem',
              color: '#e2e8f0', resize: 'vertical',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem',
              lineHeight: 1.6, outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(110,231,247,0.35)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        ) : (
          <input
            type="url"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="https://example.com/news-article"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '1rem',
              color: '#e2e8f0',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem',
              outline: 'none', transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(110,231,247,0.35)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !input.trim()}
        style={{
          width: '100%', padding: '0.875rem',
          background: loading || !input.trim()
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(135deg, #6ee7f7 0%, #818cf8 100%)',
          border: 'none', borderRadius: '12px',
          color: loading || !input.trim() ? '#475569' : '#0a0a12',
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem',
          fontWeight: 700, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s', letterSpacing: '0.02em'
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span>
            Analyzing article...
          </span>
        ) : '✦ Summarize'}
      </button>

      {error && (
        <div style={{
          marginTop: '1rem', padding: '0.875rem 1rem',
          background: 'rgba(253,164,175,0.08)',
          border: '1px solid rgba(253,164,175,0.2)',
          borderRadius: '10px', color: '#fda4af',
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem'
        }}>
          ⚠ {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '1.15rem',
            color: '#94a3b8', marginBottom: '1rem', fontWeight: 500
          }}>Summary</h2>
          <SummaryCard result={result} />
        </div>
      )}
    </div>
  )
}
