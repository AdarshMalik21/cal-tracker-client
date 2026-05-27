// pings backend every 10 minutes to prevent Render cold start
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export function startKeepAlive() {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV !== 'production') return

  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/api/profile`)
    } catch {
      // silent fail
    }
  }, 10 * 60 * 1000)   // every 10 minutes
}