export function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function daysBetween(dateA, dateB) {
  const a = new Date(dateA + 'T00:00:00')
  const b = new Date(dateB + 'T00:00:00')
  return Math.round((b - a) / 86400000)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function getMemberStatus(expiryDate) {
  const today = todayStr()
  const in5 = addDays(today, 5)
  if (expiryDate < today) {
    return { status: 'overdue', overdueDays: daysBetween(expiryDate, today) }
  } else if (expiryDate === today) {
    return { status: 'due_today', overdueDays: 0 }
  } else if (expiryDate <= in5) {
    return { status: 'upcoming', overdueDays: 0, daysLeft: daysBetween(today, expiryDate) }
  } else {
    return { status: 'active', overdueDays: 0, daysLeft: daysBetween(today, expiryDate) }
  }
}
