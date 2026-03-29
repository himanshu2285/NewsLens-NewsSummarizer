import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    if (token && username) setUser({ username, token })
  }, [])

  const login = async (username, password) => {
    const data = await apiLogin(username, password)
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('username', data.username)
    setUser({ username: data.username, token: data.access_token })
  }

  const register = async (email, username, password) => {
    const data = await apiRegister(email, username, password)
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('username', data.username)
    setUser({ username: data.username, token: data.access_token })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
