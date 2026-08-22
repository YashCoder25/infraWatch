import { useCallback, useEffect, useState } from 'react'
import { fetchProjects } from './api'

// Public, read-only view of the live database (server/data.json via the API).
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading')

  const refresh = useCallback(() => {
    return fetchProjects()
      .then((data) => {
        setProjects(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { projects, status, refresh }
}
