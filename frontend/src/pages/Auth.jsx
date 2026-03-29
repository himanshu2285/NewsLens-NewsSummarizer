import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage({ setPage }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.username, form.password)
      } else {
        if (!form.email || !form.username || !form.password)
          throw new Error('All fields are required.')
        await register(form.email, form.username, form.password)
      }
      setPage('home')
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '0.875rem 1rem',
    color: '#e2e8f0', fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.92rem', outline: 'none'
  }

  const labelStyle = {
    display: 'block', marginBottom: '0.4rem',
    color: '#64748b', fontSize: '0.8rem',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500
  }

  return (
    <div style={{
      maxWidth: '420px', margin: '4rem auto', padding: '0 1.5rem'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', padding: '2.5rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(110,231,247,0.4), transparent)'
        }} />

        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: '1.5rem',
          color: '#e2e8f0', margin: '0 0 0.5rem', textAlign: 'center'
        }}>
          {tab === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{
          color: '#475569', textAlign: 'center', fontSize: '0.875rem',
          fontFamily: "'DM Sans', sans-serif", margin: '0 0 2rem'
        }}>
          {tab === 'login' ? 'Sign in to access your history' : 'Join NewsLens today'}
        </p>

        {/* Tab switch */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px', padding: '3px', marginBottom: '1.5rem',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }} style={{
              flex: 1, padding: '0.5rem', border: 'none',
              borderRadius: '6px', cursor: 'pointer',
              background: tab === t ? 'rgba(110,231,247,0.1)' : 'transparent',
              color: tab === t ? '#6ee7f7' : '#64748b',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem',
              fontWeight: tab === t ? 600 : 400, transition: 'all 0.2s', textTransform: 'capitalize'
            }}>{t === 'login' ? 'Sign In' : 'Register'}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tab === 'register' && (
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(110,231,247,0.35)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          )}
          <div>
            <label style={labelStyle}>Username</label>
            <input type="text" placeholder="username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(110,231,247,0.35)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(110,231,247,0.35)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: '1rem', padding: '0.75rem',
            background: 'rgba(253,164,175,0.08)',
            border: '1px solid rgba(253,164,175,0.2)',
            borderRadius: '8px', color: '#fda4af',
            fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif"
          }}>⚠ {error}</div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', marginTop: '1.5rem', padding: '0.9rem',
          background: loading ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6ee7f7, #818cf8)',
          border: 'none', borderRadius: '10px',
          color: loading ? '#475569' : '#0a0a12',
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem',
          fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}>
          {loading ? '...' : tab === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}
