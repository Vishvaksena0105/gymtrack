import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { addDays, todayStr, formatDate } from '../lib/dates'

const INITIAL = {
  name: '',
  phone: '',
  location: '',
  join_date: todayStr(),
  plan_duration: '30',
  amount_paid: '',
  slot: 'Morning',
}

export default function AddMember({ onSuccess }) {
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [dupWarning, setDupWarning] = useState(null)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (field === 'phone') setDupWarning(null)
  }

  async function checkDuplicate(phone) {
    const trimmed = phone.trim()
    if (!trimmed) return
    const { data } = await supabase.from('members').select('id, name, phone').eq('phone', trimmed).limit(1)
    if (data?.length > 0) setDupWarning(data[0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!form.name.trim() || !form.phone.trim()) { setError('Name and phone are required.'); return }
    setSaving(true)
    const expiry_date = addDays(form.join_date, parseInt(form.plan_duration))
    const { error: err } = await supabase.from('members').insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      join_date: form.join_date,
      plan_duration: parseInt(form.plan_duration),
      expiry_date,
      amount_paid: form.amount_paid ? parseFloat(form.amount_paid) : null,
      slot: form.slot,
    })
    setSaving(false)
    if (err) { setError('Failed to save. Please try again.'); return }
    setForm({ ...INITIAL, join_date: todayStr() })
    onSuccess()
  }

  const previewExpiry = form.join_date ? formatDate(addDays(form.join_date, parseInt(form.plan_duration))) : ''

  return (
    <div className="p-4 md:p-6 max-w-xl">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Add New Member</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">{error}</div>
      )}
      {dupWarning && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm">
          <p className="font-bold text-amber-800">Duplicate phone number</p>
          <p className="text-amber-700 mt-0.5">Already registered to <strong>{dupWarning.name}</strong>. You can still save if intentional.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Member Info</p>

          <Field label="Full Name">
            <input type="text" required value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Rahul Sharma" className={inputCls} />
          </Field>

          <Field label="Phone Number">
            <input type="tel" required value={form.phone} onChange={e => set('phone', e.target.value)}
              onBlur={e => checkDuplicate(e.target.value)} placeholder="e.g. 9876543210" className={inputCls} />
          </Field>

          <Field label="Location">
            <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
              placeholder="e.g. Koramangala" className={inputCls} />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plan Details</p>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Join Date">
              <input type="date" required value={form.join_date} onChange={e => set('join_date', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Slot">
              <select value={form.slot} onChange={e => set('slot', e.target.value)} className={inputCls}>
                <option>Morning</option>
                <option>Evening</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Plan Duration">
              <div className="flex gap-2">
                {['30', '60'].map(d => (
                  <button key={d} type="button" onClick={() => set('plan_duration', d)}
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-colors ${
                      form.plan_duration === d ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}>
                    {d}d
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Amount Paid (₹)">
              <input type="number" value={form.amount_paid} onChange={e => set('amount_paid', e.target.value)}
                placeholder="e.g. 1500" min="0" className={inputCls} />
            </Field>
          </div>

          {/* Expiry preview */}
          {previewExpiry && (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Expiry Date</span>
              <span className="text-sm font-bold text-gray-900">{previewExpiry}</span>
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl text-sm hover:bg-gray-700 active:bg-gray-800 disabled:opacity-50 transition-colors">
          {saving ? 'Saving...' : 'Add Member'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow'
