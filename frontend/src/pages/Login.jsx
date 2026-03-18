import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const isFormValid = useMemo(() => {
    return email.trim().length > 0 && password.length >= 8
  }, [email, password])

  async function handleLogin(event) {
    event.preventDefault()
    if (!isFormValid || isLoading) return

    setIsLoading(true)
    setError('')
    setStatus('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setStatus('Logged in! Cookie set (HttpOnly).')
      navigate('/preferences/me')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRegister() {
    if (!isFormValid || isLoading) return

    setIsLoading(true)
    setError('')
    setStatus('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setStatus('Registered! Now login with the same credentials.')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="grid">
      <form className="card" onSubmit={handleLogin}>
        <h2>Login</h2>
        <label>
          Email
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>

        <div className="actions">
          <button type="submit" disabled={!isFormValid || isLoading}>
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={handleRegister}
            disabled={!isFormValid || isLoading}
          >
            Register
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        {status && !error && <p className="hint">{status}</p>}
      </form>

      <section className="card">
        <h2>How it works</h2>
        <p className="hint">
          After login the backend sets an <strong>HttpOnly</strong> cookie. The browser
          sends it automatically on every request.
        </p>
      </section>
    </main>
  )
}

export default Login
