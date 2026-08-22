import { useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { useProjects } from './useProjects.js'
import SummaryStrip from './components/SummaryStrip.jsx'
import Ledger from './components/Ledger.jsx'
import IssuePanel from './components/IssuePanel.jsx'
import AdminRoute from './admin/AdminRoute.jsx'

function PublicDashboard() {
  const [view, setView] = useState('senior')
  const [selectedId, setSelectedId] = useState(null)
  const { projects: all, status } = useProjects()

  const projects = useMemo(
    () => (view === 'officer' ? all.filter((p) => p.issue) : all),
    [view, all],
  )
  const selected = projects.find((p) => p.id === selectedId) || null

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
            <h1>InfraWatch</h1>
            <p>AI-Assisted Integrated Infrastructure Project Monitoring</p>
          </div>
        </div>
        <nav className="view-switch" aria-label="Role view">
          {['senior', 'officer'].map((v) => (
            <button key={v} className={v === view ? 'is-active' : ''} onClick={() => setView(v)}>
              {v === 'senior' ? 'PMO / Cabinet View' : 'Monitoring Officer View'}
            </button>
          ))}
        </nav>
      </header>

      <SummaryStrip projects={all} />
      <main className="workspace">
        <Ledger projects={projects} onSelect={setSelectedId} selectedId={selectedId} />
        <IssuePanel project={selected} />
      </main>
      <footer className="footnote">
        Explainable risk detection: status changes the moment planned progress, actual progress,
        or budget figures are updated — no manual recalculation.
        <Link className="btn--link" to="/admin">Admin login</Link>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicDashboard />} />
      <Route path="/admin" element={<AdminRoute />} />
    </Routes>
  )
}
