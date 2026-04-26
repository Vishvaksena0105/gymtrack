import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import MemberCard from './MemberCard'
import { getMemberStatus } from '../lib/dates'

const SLOT_FILTERS = ['All', 'Morning', 'Evening']
const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'due_today', label: 'Due Today' },
  { id: 'upcoming', label: 'Due Soon' },
  { id: 'active', label: 'Active' },
]

export default function AllMembers({ onRenew, refreshKey }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [slotFilter, setSlotFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('expiry')

  useEffect(() => { fetchAll() }, [refreshKey])

  async function fetchAll() {
    setLoading(true)
    const { data } = await supabase
      .from('members')
      .select('*')
      .order('expiry_date', { ascending: true })
    setMembers(data || [])
    setLoading(false)
  }

  let filtered = members

  if (slotFilter !== 'All') {
    filtered = filtered.filter(m => m.slot === slotFilter)
  }

  if (statusFilter !== 'all') {
    filtered = filtered.filter(m => getMemberStatus(m.expiry_date).status === statusFilter)
  }

  if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  }

  const counts = {
    overdue: members.filter(m => getMemberStatus(m.expiry_date).status === 'overdue').length,
    due_today: members.filter(m => getMemberStatus(m.expiry_date).status === 'due_today').length,
    upcoming: members.filter(m => getMemberStatus(m.expiry_date).status === 'upcoming').length,
    active: members.filter(m => getMemberStatus(m.expiry_date).status === 'active').length,
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl">

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">All Members</h2>
          {!loading && (
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {filtered.length} of {members.length} members
            </p>
          )}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="expiry">Sort: Expiry</option>
          <option value="name">Sort: Name A–Z</option>
        </select>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-hide">
        {STATUS_FILTERS.map(f => {
          const count = f.id === 'all' ? members.length : counts[f.id]
          return (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                statusFilter === f.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {f.label} {count > 0 && <span className="opacity-60 ml-0.5">{count}</span>}
            </button>
          )
        })}
      </div>

      {/* Slot filter */}
      <div className="flex gap-2 mb-5">
        {SLOT_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setSlotFilter(s)}
            className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-colors ${
              slotFilter === s
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {s === 'All' ? 'All Slots' : `${s} Slot`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-300 text-4xl mb-2">👥</p>
          <p className="text-sm text-gray-400 font-medium">No members match this filter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(m => (
            <MemberCard key={m.id} member={m} onRenew={onRenew} showStatus />
          ))}
        </div>
      )}
    </div>
  )
}
