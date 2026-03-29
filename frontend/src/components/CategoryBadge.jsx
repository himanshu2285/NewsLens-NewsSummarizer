const COLORS = {
  Tech: { bg: 'rgba(110,231,247,0.15)', text: '#6ee7f7', border: 'rgba(110,231,247,0.3)' },
  Sports: { bg: 'rgba(134,239,172,0.15)', text: '#86efac', border: 'rgba(134,239,172,0.3)' },
  Business: { bg: 'rgba(252,211,77,0.15)', text: '#fcd34d', border: 'rgba(252,211,77,0.3)' },
  Health: { bg: 'rgba(249,168,212,0.15)', text: '#f9a8d4', border: 'rgba(249,168,212,0.3)' },
  Politics: { bg: 'rgba(196,181,253,0.15)', text: '#c4b5fd', border: 'rgba(196,181,253,0.3)' },
  Science: { bg: 'rgba(103,232,249,0.15)', text: '#67e8f9', border: 'rgba(103,232,249,0.3)' },
  Entertainment: { bg: 'rgba(253,164,175,0.15)', text: '#fda4af', border: 'rgba(253,164,175,0.3)' },
  World: { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
  Other: { bg: 'rgba(203,213,225,0.1)', text: '#cbd5e1', border: 'rgba(203,213,225,0.2)' },
}

export default function CategoryBadge({ category, size = 'md' }) {
  const c = COLORS[category] || COLORS.Other
  const pad = size === 'sm' ? '0.2rem 0.6rem' : '0.3rem 0.8rem'
  const fs = size === 'sm' ? '0.72rem' : '0.8rem'

  return (
    <span style={{
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: '999px', padding: pad,
      fontSize: fs, fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: '0.03em',
      display: 'inline-block'
    }}>
      {category}
    </span>
  )
}
