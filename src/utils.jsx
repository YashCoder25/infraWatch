import { RISK_LABEL, freshnessOf } from './riskEngine.js'

export function Stamp({ risk }) {
  return (
    <span className={`stamp stamp--${risk}`} aria-label={RISK_LABEL[risk]}>
      {RISK_LABEL[risk]}
    </span>
  )
}

export function Freshness({ days }) {
  const state = freshnessOf(days)
  const label = days === 1 ? '1 day ago' : `${days} days ago`
  return (
    <span className={`fresh-dot fresh-dot--${state}`} title={`Last updated ${label}`}>
      <i />
      {label}
    </span>
  )
}
