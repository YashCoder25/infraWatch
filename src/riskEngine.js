export function riskOf(p) {
  const gap = p.planned - p.actual
  if (gap >= 15) return 'delayed'
  if (gap >= 6) return 'at-risk'
  return 'on-track'
}

export function freshnessOf(days) {
  if (days <= 3) return 'fresh'
  if (days <= 10) return 'aging'
  return 'stale'
}

export const RISK_LABEL = { 'on-track': 'On Track', 'at-risk': 'At Risk', delayed: 'Delayed' }

export function currency(cr) {
  return `₹${cr.toLocaleString('en-IN')} Cr`
}
