import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SummaryStrip from '../components/SummaryStrip.jsx'
import Ledger from '../components/Ledger.jsx'
import IssuePanel from '../components/IssuePanel.jsx'
import ProjectForm from '../ProjectForm.jsx'
import { useAdminProjects } from './useAdminProjects.js'

export default function AdminDashboard({ token, onLogout }) {
  const [view, setView] = useState('senior')
  const [selectedId, setSelectedId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const { projects: all, status, actionError, addProject, updateProject, deleteProject, refresh } = useAdminProjects(token)

  const projects = useMemo(
    () => (view === 'officer' ? all.filter((p) => p.issue) : all),
    [view, all],
  )
  const selected = projects.find((p) => p.id === selectedId) || null

  function openAdd() {
    setEditingProject(null)
    setFormOpen(true)
  }
  function openEdit(p) {
    setEditingProject(p)
    setFormOpen(true)
  }
  async function handleSave(record) {
    if (editingProject) {
      await updateProject(editingProject.id, record)
    } else {
      await addProject(record)
    }
    setFormOpen(false)
    setEditingProject(null)
  }
  function handleDelete(id) {
    if (!window.confirm(`Delete project ${id}? This cannot be undone.`)) return
    if (id === selectedId) setSelectedId(null)
    deleteProject(id)
  }

  if (status === 'loading') {
    return <div className="app-status">Loading project ledger…</div>
  }
  if (status === 'error') {
    return (
      <div className="app-status">
        Could not reach the InfraWatch API. Confirm the backend server is running.
      </div>
    )
  }

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead__id">
          <span className="masthead__mark">IW</span>
          <div>
            <h1>InfraWatch Admin</h1>
            <p>Editing the live project ledger</p>
          </div>
        </div>
        <nav className="view-switch" aria-label="Role view">
          {['senior', 'officer'].map((v) => (
            <button key={v} className={v === view ? 'is-active' : ''} onClick={() => setView(v)}>
              {v === 'senior' ? 'PMO / Cabinet View' : 'Monitoring Officer View'}
            </button>
          ))}
        </nav>
        <div className="admin-bar">
          <Link className="btn btn--ghost" to="/">View public dashboard</Link>
          <button className="btn btn--ghost" onClick={onLogout}>Log out</button>
        </div>
      </header>

      {actionError && <p className="admin-login__error admin-bar__error">{actionError}</p>}

      <SummaryStrip projects={all} />
      <main className="workspace">
        <Ledger
          projects={projects}
          onSelect={setSelectedId}
          selectedId={selectedId}
          admin
          onEdit={openEdit}
          onDelete={handleDelete}
          onAdd={openAdd}
        />
        <IssuePanel project={selected} />
      </main>
      <footer className="footnote">
        Explainable risk detection: status changes the moment planned progress, actual progress,
        or budget figures are updated — changes are written straight to the live database.
        <button className="btn btn--link" onClick={refresh}>Refresh from server</button>
      </footer>

      {formOpen && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setFormOpen(false)}>
          <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
            <ProjectForm
              editing={editingProject}
              onSave={handleSave}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
