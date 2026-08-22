import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminLogin({ onLogin, error }) {
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    await onLogin(password)
    setSubmitting(false)
  }

  return (
    <div className="admin-login">
      <form className="admin-login__panel" onSubmit={submit}>
        <span className="masthead__mark">IW</span>
        <h1>Admin Login</h1>
        <p>Sign in to manage the InfraWatch project ledger.</p>
        <label>
          Password
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="admin-login__error">{error}</p>}
        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        <Link className="btn--link" to="/">← Back to public dashboard</Link>
      </form>
    </div>
  )
}
