import { useState } from 'react'
import { AuthProvider } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import History from './pages/History'
import AuthPage from './pages/Auth'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', background: '#0a0a12', color: '#e2e8f0' }}>
        <Navbar page={page} setPage={setPage} />
        {page === 'home' && <Home />}
        {page === 'history' && <History />}
        {page === 'auth' && <AuthPage setPage={setPage} />}
      </div>
    </AuthProvider>
  )
}
