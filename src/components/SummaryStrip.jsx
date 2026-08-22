import { currency, riskOf } from '../riskEngine.js'

export default function SummaryStrip({ projects }) {
  const totalInvestment = projects.reduce((s, p) => s + p.budgetCr, 0)
  const highRisk = projects.filter((p) => riskOf(p) !== 'on-track').length
  const openActions = projects.filter((p) => p.issue).length

  const cards = [
    { label: 'Projects Tracked', value: projects.length, tone: 'steel' },
    { label: 'Total Investment', value: currency(totalInvestment), tone: 'steel' },
    { label: 'High-Risk Alerts', value: highRisk, tone: 'risk' },
    { label: 'Open Corrective Actions', value: openActions, tone: 'warn' },
  ]

  return (
    <section className="summary" aria-label="Executive summary">
      {cards.map((c) => (
        <div key={c.label} className={`summary__card summary__card--${c.tone}`}>
          <span className="summary__value">{c.value}</span>
          <span className="summary__label">{c.label}</span>
        </div>
      ))}
    </section>
  )
}
