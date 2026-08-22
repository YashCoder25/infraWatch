import { Stamp } from '../utils.jsx'
import { currency, riskOf } from '../riskEngine.js'
import { Freshness } from '../utils.jsx'

export default function IssuePanel({ project }) {
  if (!project) {
    return (
      <aside className="issue-panel issue-panel--empty">
        <p>Select a project from the ledger to review its corrective-action record.</p>
      </aside>
    )
  }
  const risk = riskOf(project)
  return (
    <aside className="issue-panel">
      <div className="issue-panel__header">
        <span className="mono">{project.id}</span>
        <Stamp risk={risk} />
      </div>
      <h3>{project.name}</h3>
      <dl className="issue-panel__facts">
        <div><dt>Planned vs. Actual</dt><dd>{project.planned}% / {project.actual}%</dd></div>
        <div><dt>Budget Utilised</dt><dd>{currency(project.spentCr)} of {currency(project.budgetCr)}</dd></div>
        <div><dt>Last Data Refresh</dt><dd><Freshness days={project.lastUpdate} /></dd></div>
      </dl>

      {project.issue ? (
        <div className="corrective">
          <h4>Corrective Action</h4>
          <p className="corrective__cause">{project.issue.cause}</p>
          <dl className="issue-panel__facts">
            <div><dt>Action</dt><dd>{project.issue.action}</dd></div>
            <div><dt>Responsible Agency</dt><dd>{project.issue.owner}</dd></div>
            <div><dt>Target Date</dt><dd>{project.issue.due}</dd></div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className={`chip chip--${project.issue.status}`}>
                  {project.issue.status === 'overdue' ? 'Overdue' : 'In Progress'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="corrective corrective--clear">No open issue. Project is progressing within tolerance.</p>
      )}
    </aside>
  )
}
