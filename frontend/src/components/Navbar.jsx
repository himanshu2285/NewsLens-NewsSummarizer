import { useAuth } from '../hooks/useAuth'

const CATEGORY_COLORS = {
  Tech: '#6ee7f7', Sports: '#86efac', Business: '#fcd34d',
  Health: '#f9a8d4', Politics: '#c4b5fd', Science: '#67e8f9',
  Entertainment: '#fda4af', World: '#94a3b8', Other: '#cbd5e1'
}

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0 2rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: '60px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        onClick={() => setPage('home')}>
        <span style={{ fontSize: '1.4rem' }}>📰</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#e2e8f0', fontWeight: 700 }}>
          NewsLens
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {['home', 'history'].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: page === p ? '#6ee7f7' : '#94a3b8',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
            fontWeight: page === p ? 600 : 400,
            textTransform: 'capitalize', padding: '0.25rem 0',
            borderBottom: page === p ? '2px solid #6ee7f7' : '2px solid transparent',
            transition: 'all 0.2s'
          }}>
            {p === 'home' ? 'Summarize' : 'History'}
          </button>
        ))}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>👤 {user.username}</span>
            <button onClick={logout} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', borderRadius: '6px', padding: '0.3rem 0.8rem',
              cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif"
            }}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setPage('auth')} style={{
            background: 'linear-gradient(135deg, #6ee7f7, #818cf8)',
            border: 'none', color: '#0a0a12', borderRadius: '6px',
            padding: '0.4rem 1rem', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif"
          }}>Sign In</button>
        )}
      </div>
    </nav>
  )
}
