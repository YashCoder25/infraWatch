import { useCallback, useEffect, useState } from 'react'
import { checkSession, login as loginApi, logout as logoutApi } from '../api'

const TOKEN_KEY = 'infrawatch-admin-token'

export function useAdminAuth() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY))
  const [checking, setChecking] = useState(!!token)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    checkSession(token)
      .then(() => setChecking(false))
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setChecking(false)
      })
  }, [token])

  const login = useCallback(async (password) => {
    setError('')
    try {
      const { token: newToken } = await loginApi(password)
      sessionStorage.setItem(TOKEN_KEY, newToken)
      setToken(newToken)
      return true
    } catch (err) {
      setError(err.message || 'Login failed.')
      return false
    }
  }, [])

  const logout = useCallback(() => {
    if (token) logoutApi(token).catch(() => {})
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [token])

  return { token, isAuthenticated: !!token, checking, error, login, logout }
}
