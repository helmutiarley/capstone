import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PreferencesMe() {
  const [prefs, setPrefs] = useState(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function fetchPreferences() {
    setIsLoading(true)
    setError('')
    setStatus('')

    try {
      const response = await fetch('/api/preferences/me', {
        credentials: 'include',
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = data.error || 'Could not fetch preferences'
        throw new Error(message)
      }

      setPrefs(data)
      setStatus('Preferences loaded.')
    } catch (err) {
      setPrefs(null)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    setIsLoading(true)
    setError('')
    setStatus('')

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Logout failed')
      }

      setPrefs(null)
      setStatus('Logged out. Please log in again.')
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])

  return (
    <main className="grid">
      <section className="card">
        <h2>Your Preferences</h2>
        {prefs ? (
          <textarea readOnly rows={8} value={JSON.stringify(prefs, null, 2)} />
        ) : (
          <p className="hint">
            {error || 'No preferences loaded yet.'}
          </p>
        )}

        {status && !error && <p className="hint">{status}</p>}
        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="button" className="ghost" onClick={fetchPreferences} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button type="button" className="ghost" onClick={handleLogout} disabled={isLoading}>
            Logout
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Need access?</h2>
        <p className="hint">
          If you see “Unauthorized”, log in first so the HttpOnly cookie is set.
        </p>
        <button type="button" className="ghost" onClick={() => navigate('/')}
          disabled={isLoading}
        >
          Go to login
        </button>
      </section>
    </main>
  )
}

export default PreferencesMe
