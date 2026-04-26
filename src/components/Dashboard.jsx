import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { todayStr, addDays, getMemberStatus } from '../lib/dates'
import MemberCard from './MemberCard'

async function exportCSV() {
  const { data, error } = await supabase.from('members').select('*').order('name')
  if (error || !data) return
  const headers = ['Name', 'Phone', 'Location', 'Slot', 'Join Date', 'Plan (days)', 'Expiry Date', 'Amount Paid (₹)', 'Status']
  const rows = data.map((m) => {
    const { status, overdueDays } = getMemberStatus(m.expiry_date)
    const label = status === 'overdue' ? `Overdue (${overdueDays}d)` : status === 'due_today' ? 'Due Today' : status === 'upcoming' ? 'Due Soon' : 'Active'
    return [m.name, m.phone, m.location || '', m.slot, m.join_date, m.plan_duration, m.expiry_date, m.amount_paid ?? '', label]
  })
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `hanuman-gym-${todayStr()}.csv` })
  a.click()
}

function StatCard({ value, label, color }) {
  return (
    <div className={`rounded-2xl p-4 flex flex-col gap-1 ${color}`}>
      <span className="text-2xl font-bold leading-none">{value}</span>
      <span className="text-xs font-semibold opacity-75">{label}</span>
    </div>
  )
}

function SectionHeader({ title, count, pill }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{title}</h2>
      {count > 0 && (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pill}`}>{count}</span>
      )}
    </div>
  )
}

export default function Dashboard({ onRenew, refreshKey, onNavigate }) {
  const [data, setData] = useState({ dueToday: [], upcoming: [], overdue: [] })
  const [totalMembers, setTotalMembers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => { fetchData() }, [refreshKey])

  async function fetchData() {
    setLoading(true)
    setError(null)
    const today = todayStr()
    const in5Days = addDays(today, 5)

    const [alertRes, countRes] = await Promise.all([
      supabase.from('members').select('*').lte('expiry_date', in5Days).order('expiry_date'),
      supabase.from('members').select('id', { count: 'exact', head: true }),
    ])

    if (alertRes.error) {
      setError('Could not load data. Check your Supabase connection.')
      setLoading(false)
      return
    }

    const rows = alertRes.data
    setData({
      overdue: rows.filter(m => m.expiry_date < today),
      dueToday: rows.filter(m => m.expiry_date === today),
      upcoming: rows.filter(m => m.expiry_date > today && m.expiry_date <= in5Days),
    })
    setTotalMembers(countRes.count ?? 0)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="m-6 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
        {error}
      </div>
    )
  }

  const alertCount = data.overdue.length + data.dueToday.length + data.upcoming.length

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl">

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard value={totalMembers} label="Total Members" color="bg-gray-900 text-white" />
        <StatCard value={data.overdue.length} label="Overdue" color="bg-red-50 text-red-700" />
        <StatCard value={data.dueToday.length} label="Due Today" color="bg-amber-50 text-amber-700" />
        <StatCard value={data.upcoming.length} label="Due in 5 Days" color="bg-blue-50 text-blue-700" />
      </div>

      {/* Top actions */}
      <div className="flex items-center justify-between">
        {alertCount === 0 ? (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/></svg>
            <span className="text-sm font-semibold">All memberships are active</span>
          </div>
        ) : (
          <p className="text-sm text-gray-500 font-medium">{alertCount} member{alertCount !== 1 ? 's' : ''} need attention</p>
        )}
        <button
          onClick={async () => { setExporting(true); await exportCSV(); setExporting(false) }}
          disabled={exporting}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Overdue */}
      {data.overdue.length > 0 && (
        <section>
          <SectionHeader title="Overdue" count={data.overdue.length} pill="bg-red-100 text-red-700" />
          <div className="space-y-2">
            {data.overdue.map(m => <MemberCard key={m.id} member={m} onRenew={onRenew} />)}
          </div>
        </section>
      )}

      {/* Due Today */}
      {data.dueToday.length > 0 && (
        <section>
          <SectionHeader title="Due Today" count={data.dueToday.length} pill="bg-amber-100 text-amber-700" />
          <div className="space-y-2">
            {data.dueToday.map(m => <MemberCard key={m.id} member={m} onRenew={onRenew} />)}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {data.upcoming.length > 0 && (
        <section>
          <SectionHeader title="Upcoming — Next 5 Days" count={data.upcoming.length} pill="bg-blue-100 text-blue-700" />
          <div className="space-y-2">
            {data.upcoming.map(m => <MemberCard key={m.id} member={m} onRenew={onRenew} />)}
          </div>
        </section>
      )}

      {/* All clear */}
      {alertCount === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-300 text-5xl mb-3">✓</p>
          <p className="text-gray-400 text-sm font-medium">No dues in the next 5 days</p>
          <button onClick={() => onNavigate('members')} className="mt-3 text-sm text-gray-900 font-semibold underline underline-offset-2">
            View all members →
          </button>
        </div>
      )}
    </div>
  )
}
