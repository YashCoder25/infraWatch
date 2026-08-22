import { Freshness, Stamp } from '../utils.jsx'
import { currency, riskOf } from '../riskEngine.js'

export default function Ledger({ projects, onSelect, selectedId, admin = false, onEdit, onDelete, onAdd }) {
  return (
    <section className="ledger" aria-label="Project ledger">
      <div className="ledger__head">
        <div>
          <h2>Project Ledger</h2>
          <p>Risk status recalculates automatically as progress and budget figures are updated.</p>
        </div>
        {admin && <button className="btn btn--primary" onClick={onAdd}>+ Add Project</button>}
      </div>
      <table>
        <thead>
          <tr>
            <th>Ref</th>
            <th>Project</th>
            <th>Ministry / Agency</th>
            <th>Progress</th>
            <th>Budget</th>
            <th>Data</th>
            <th>Status</th>
            {admin && <th></th>}
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 && (
            <tr><td colSpan={admin ? 8 : 7} className="ledger__empty">No projects in the ledger.{admin ? ' Add one to begin tracking.' : ''}</td></tr>
          )}
          {projects.map((p) => {
            const risk = riskOf(p)
            return (
              <tr
                key={p.id}
                className={p.id === selectedId ? 'is-selected' : ''}
                onClick={() => onSelect(p.id)}
              >
                <td className="mono">{p.id}</td>
                <td className="ledger__name">{p.name}</td>
                <td>
                  <span className="ledger__ministry">{p.ministry}</span>
                  <span className="ledger__agency">{p.agency}</span>
                </td>
                <td>
                  <div className="progress" title={`Planned ${p.planned}% · Actual ${p.actual}%`}>
                    <div className="progress__planned" style={{ width: `${p.planned}%` }} />
                    <div className={`progress__actual progress__actual--${risk}`} style={{ width: `${p.actual}%` }} />
                  </div>
                  <span className="progress__figures mono">{p.actual}% of {p.planned}%</span>
                </td>
                <td className="mono">{currency(p.spentCr)} / {currency(p.budgetCr)}</td>
                <td><Freshness days={p.lastUpdate} /></td>
                <td><Stamp risk={risk} /></td>
                {admin && (
                  <td className="ledger__rowactions" onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn--icon" onClick={() => onEdit(p)} aria-label={`Edit ${p.id}`}>Edit</button>
                    <button className="btn btn--icon btn--danger" onClick={() => onDelete(p.id)} aria-label={`Delete ${p.id}`}>Delete</button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
