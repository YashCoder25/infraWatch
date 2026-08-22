import { useState } from 'react'

const BLANK = {
  name: '', agency: '', ministry: '',
  budgetCr: '', spentCr: '', planned: '', actual: '', lastUpdate: '',
  hasIssue: false, cause: '', action: '', owner: '', due: '', issueStatus: 'in-progress',
}

function toFormState(p) {
  if (!p) return BLANK
  return {
    name: p.name, agency: p.agency, ministry: p.ministry,
    budgetCr: p.budgetCr, spentCr: p.spentCr, planned: p.planned, actual: p.actual, lastUpdate: p.lastUpdate,
    hasIssue: !!p.issue,
    cause: p.issue?.cause || '', action: p.issue?.action || '', owner: p.issue?.owner || '',
    due: p.issue?.due || '', issueStatus: p.issue?.status || 'in-progress',
  }
}

export default function ProjectForm({ editing, onSave, onCancel }) {
  const [f, setF] = useState(() => toFormState(editing))

  function set(key, value) {
    setF((prev) => ({ ...prev, [key]: value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!f.name.trim()) return
    const record = {
      name: f.name.trim(),
      agency: f.agency.trim(),
      ministry: f.ministry.trim(),
      budgetCr: Number(f.budgetCr) || 0,
      spentCr: Number(f.spentCr) || 0,
      planned: Number(f.planned) || 0,
      actual: Number(f.actual) || 0,
      lastUpdate: Number(f.lastUpdate) || 0,
      issue: f.hasIssue
        ? { cause: f.cause, action: f.action, owner: f.owner, due: f.due, status: f.issueStatus }
        : null,
    }
    onSave(record)
  }

  return (
    <form className="pform" onSubmit={submit}>
      <h3>{editing ? `Edit ${editing.id}` : 'Add Project'}</h3>

      <label>Project name
        <input value={f.name} onChange={(e) => set('name', e.target.value)} required />
      </label>

      <div className="pform__row">
        <label>Agency
          <input value={f.agency} onChange={(e) => set('agency', e.target.value)} />
        </label>
        <label>Ministry
          <input value={f.ministry} onChange={(e) => set('ministry', e.target.value)} />
        </label>
      </div>

      <div className="pform__row">
        <label>Budget (₹ Cr)
          <input type="number" value={f.budgetCr} onChange={(e) => set('budgetCr', e.target.value)} />
        </label>
        <label>Spent (₹ Cr)
          <input type="number" value={f.spentCr} onChange={(e) => set('spentCr', e.target.value)} />
        </label>
      </div>

      <div className="pform__row">
        <label>Planned %
          <input type="number" value={f.planned} onChange={(e) => set('planned', e.target.value)} />
        </label>
        <label>Actual %
          <input type="number" value={f.actual} onChange={(e) => set('actual', e.target.value)} />
        </label>
        <label>Data age (days)
          <input type="number" value={f.lastUpdate} onChange={(e) => set('lastUpdate', e.target.value)} />
        </label>
      </div>

      <label className="pform__check">
        <input type="checkbox" checked={f.hasIssue} onChange={(e) => set('hasIssue', e.target.checked)} />
        Open corrective-action issue
      </label>

      {f.hasIssue && (
        <fieldset className="pform__issue">
          <label>Cause
            <input value={f.cause} onChange={(e) => set('cause', e.target.value)} />
          </label>
          <label>Corrective action
            <input value={f.action} onChange={(e) => set('action', e.target.value)} />
          </label>
          <div className="pform__row">
            <label>Responsible agency
              <input value={f.owner} onChange={(e) => set('owner', e.target.value)} />
            </label>
            <label>Target date
              <input type="date" value={f.due} onChange={(e) => set('due', e.target.value)} />
            </label>
          </div>
          <label>Status
            <select value={f.issueStatus} onChange={(e) => set('issueStatus', e.target.value)}>
              <option value="in-progress">In Progress</option>
              <option value="overdue">Overdue</option>
            </select>
          </label>
        </fieldset>
      )}

      <div className="pform__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary">{editing ? 'Save changes' : 'Add project'}</button>
      </div>
    </form>
  )
}
