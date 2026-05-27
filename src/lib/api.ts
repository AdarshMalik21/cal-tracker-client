import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

api.interceptors.response.use(
  res => res,
  err => {
    console.error('API Error:', err.response?.data?.message || err.message)
    return Promise.reject(err)
  }
)

export default api