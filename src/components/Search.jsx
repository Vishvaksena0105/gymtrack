import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import MemberCard from './MemberCard'

export default function Search({ onRenew }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  function handleChange(e) {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setResults([]); setSearched(false); return }
    debounceRef.current = setTimeout(() => doSearch(val.trim()), 350)
  }

  async function doSearch(q) {
    setLoading(true)
    setSearched(true)
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
      .order('expiry_date', { ascending: true })
      .limit(30)
    setLoading(false)
    if (!error) setResults(data)
  }

  function clear() { setQuery(''); setResults([]); setSearched(false) }

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Search Members</h2>

      {/* Search box */}
      <div className="relative mb-5">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search by name or phone..."
          className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-10 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 shadow-sm"
          autoComplete="off"
        />
        {query && (
          <button onClick={clear} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-300 text-4xl mb-2">🔍</p>
          <p className="text-sm text-gray-500 font-medium">No members found for "{query}"</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          <div className="space-y-2">
            {results.map(m => <MemberCard key={m.id} member={m} onRenew={onRenew} showStatus />)}
          </div>
        </div>
      )}

      {!query && !searched && (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">Type a name or phone number</p>
        </div>
      )}
    </div>
  )
}
