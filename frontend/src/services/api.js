import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const summarizeText = (text) =>
  api.post('/summarize', { text }).then((r) => r.data)

export const summarizeUrl = (url) =>
  api.post('/summarize', { url }).then((r) => r.data)

export const getHistory = (params = {}) =>
  api.get('/history', { params }).then((r) => r.data)

export const deleteSummary = (id) =>
  api.delete(`/history/${id}`).then((r) => r.data)

export const login = (username, password) => {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  return axios.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then((r) => r.data)
}

export const register = (email, username, password) =>
  api.post('/auth/register', { email, username, password }).then((r) => r.data)

export default api
