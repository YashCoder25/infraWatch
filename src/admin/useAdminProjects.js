import { useCallback, useEffect, useState } from 'react'
import { createProject, deleteProjectApi, fetchProjects, updateProjectApi } from '../api'

export function useAdminProjects(token) {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading')
  const [actionError, setActionError] = useState('')

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

  const addProject = useCallback(
    async (fields) => {
      setActionError('')
      try {
        const record = await createProject(token, fields)
        setProjects((prev) => [...prev, record])
      } catch (err) {
        setActionError(err.message || 'Could not add project.')
      }
    },
    [token],
  )

  const updateProject = useCallback(
    async (id, fields) => {
      setActionError('')
      try {
        const record = await updateProjectApi(token, id, fields)
        setProjects((prev) => prev.map((p) => (p.id === id ? record : p)))
      } catch (err) {
        setActionError(err.message || 'Could not update project.')
      }
    },
    [token],
  )

  const deleteProject = useCallback(
    async (id) => {
      setActionError('')
      try {
        await deleteProjectApi(token, id)
        setProjects((prev) => prev.filter((p) => p.id !== id))
      } catch (err) {
        setActionError(err.message || 'Could not delete project.')
      }
    },
    [token],
  )

  return { projects, status, actionError, refresh, addProject, updateProject, deleteProject }
}
