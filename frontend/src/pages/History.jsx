import { useState, useEffect } from 'react'
import { getHistory, deleteSummary } from '../services/api'
import SummaryCard from '../components/SummaryCard'
import CategoryBadge from '../components/CategoryBadge'

const CATEGORIES = ['All', 'Tech', 'Sports', 'Business', 'Health', 'Politics', 'Science', 'Entertainment', 'World', 'Other']

export default function History() {
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const fetchHistory = async (category) => {
    setLoading(true)
    setError('')
    try {
      const params = category && category !== 'All' ? { category } : {}
      const data = await getHistory(params)
      setSummaries(data)
    } catch (e) {
      setError('Failed to load history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory(activeCategory) }, [activeCategory])

  const handleDelete = async (id) => {
    try {
      await deleteSummary(id)
      setSummaries(prev => prev.filter(s => s.id !== id))
    } catch {
      alert('Failed to delete.')
    }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', color: '#e2e8f0', margin: '0 0 0.5rem'
        }}>History</h1>
        <p style={{ color: '#475569', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', margin: 0 }}>
          Your past summaries
        </p>
      </div>

      {/* Category filter */}
      <div style={{
        display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem'
      }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            background: activeCategory === cat ? 'rgba(110,231,247,0.12)' : 'rgba(255,255,255,0.04)',
            border: activeCategory === cat ? '1px solid rgba(110,231,247,0.3)' : '1px solid rgba(255,255,255,0.07)',
            borderRadius: '999px', padding: '0.3rem 0.9rem',
            color: activeCategory === cat ? '#6ee7f7' : '#64748b',
            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s'
          }}>
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: '#475569', padding: '3rem', fontFamily: "'DM Sans', sans-serif" }}>
          <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', fontSize: '1.5rem' }}>⟳</span>
          <p style={{ marginTop: '0.5rem' }}>Loading history...</p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '1rem', background: 'rgba(253,164,175,0.08)',
          border: '1px solid rgba(253,164,175,0.2)', borderRadius: '10px',
          color: '#fda4af', fontFamily: "'DM Sans', sans-serif"
        }}>{error}</div>
      )}

      {!loading && !error && summaries.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          color: '#334155', fontFamily: "'DM Sans', sans-serif"
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</div>
          <p style={{ fontSize: '1.1rem', color: '#475569' }}>No summaries yet</p>
          <p style={{ fontSize: '0.875rem', color: '#334155' }}>Go summarize a news article to see it here</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {summaries.map(s => (
          <SummaryCard
            key={s.id}
            result={s}
            onDelete={() => handleDelete(s.id)}
          />
        ))}
      </div>
    </div>
  )
}
