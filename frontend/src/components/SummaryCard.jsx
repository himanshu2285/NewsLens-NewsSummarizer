import { useState } from 'react'
import CategoryBadge from './CategoryBadge'

export default function SummaryCard({ result, onDelete }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = result.summary.map((b, i) => `${i + 1}. ${b}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', padding: '1.75rem',
      animation: 'fadeSlideIn 0.4s ease',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Glow accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(110,231,247,0.4), transparent)'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <CategoryBadge category={result.category} />
          {result.created_at && (
            <span style={{ color: '#475569', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif" }}>
              {formatDate(result.created_at)}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleCopy} title="Copy summary" style={{
            background: copied ? 'rgba(110,231,247,0.15)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '0.4rem 0.75rem',
            color: copied ? '#6ee7f7' : '#64748b',
            cursor: 'pointer', fontSize: '0.8rem',
            fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s'
          }}>
            {copied ? '✓ Copied' : '⧉ Copy'}
          </button>
          {onDelete && (
            <button onClick={onDelete} title="Delete" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px', padding: '0.4rem 0.6rem',
              color: '#475569', cursor: 'pointer', fontSize: '0.85rem',
              transition: 'all 0.2s'
            }}>✕</button>
          )}
        </div>
      </div>

      {result.input_type === 'url' && (
        <div style={{
          marginBottom: '1rem', padding: '0.5rem 0.75rem',
          background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
          borderLeft: '2px solid rgba(110,231,247,0.3)'
        }}>
          <span style={{ color: '#475569', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif" }}>🔗 </span>
          <span style={{
            color: '#64748b', fontSize: '0.78rem',
            fontFamily: "'DM Sans', sans-serif",
            wordBreak: 'break-all'
          }}>{result.original_input}</span>
        </div>
      )}

      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {result.summary.map((point, i) => (
          <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{
              minWidth: '22px', height: '22px', borderRadius: '50%',
              background: 'rgba(110,231,247,0.1)', border: '1px solid rgba(110,231,247,0.2)',
              color: '#6ee7f7', fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: '2px', flexShrink: 0
            }}>{i + 1}</span>
            <span style={{
              color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6',
              fontFamily: "'DM Sans', sans-serif"
            }}>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
