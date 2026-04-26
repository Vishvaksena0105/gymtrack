import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { todayStr, addDays, formatDate } from '../lib/dates'

export default function RenewModal({ member, onClose }) {
  const [plan, setPlan] = useState('30')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const today = todayStr()
  const newExpiry = addDays(today, parseInt(plan))
  const initials = member.name.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase()

  async function handleRenew() {
    setSaving(true)
    setError(null)
    const { error: err } = await supabase
      .from('members')
      .update({ plan_duration: parseInt(plan), expiry_date: newExpiry, join_date: today })
      .eq('id', member.id)
    setSaving(false)
    if (err) { setError('Failed to renew. Please try again.'); return }
    onClose(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onClose(false)} />

      {/* Sheet / Dialog */}
      <div className="relative w-full md:max-w-sm bg-white md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gray-900 px-5 pt-6 pb-5">
          <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">{member.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{member.phone}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">{error}</div>
          )}

          {/* Plan selector */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Plan</p>
            <div className="flex gap-3">
              {['30', '60'].map(d => (
                <button key={d} onClick={() => setPlan(d)}
                  className={`flex-1 py-3.5 rounded-xl border-2 font-bold text-sm transition-all ${
                    plan === d ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}>
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-400 font-medium">Renewal Date</span>
              <span className="font-semibold text-gray-900">{formatDate(today)}</span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-400 font-medium">New Expiry</span>
              <span className="font-bold text-gray-900">{formatDate(newExpiry)}</span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-400 font-medium">Previous Expiry</span>
              <span className="text-gray-300 line-through">{formatDate(member.expiry_date)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={() => onClose(false)}
              className="flex-1 py-3.5 border-2 border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:border-gray-400 transition-colors">
              Cancel
            </button>
            <button onClick={handleRenew} disabled={saving}
              className="flex-1 py-3.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors">
              {saving ? 'Renewing...' : 'Confirm Renew'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
