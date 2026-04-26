import { useState } from 'react'
import Dashboard from './components/Dashboard'
import AllMembers from './components/AllMembers'
import AddMember from './components/AddMember'
import Search from './components/Search'
import RenewModal from './components/RenewModal'

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    id: 'members',
    label: 'Members',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.366-1.764.441z" />
      </svg>
    ),
  },
  {
    id: 'add',
    label: 'Add',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'search',
    label: 'Search',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [renewMember, setRenewMember] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function triggerRefresh() { setRefreshKey(k => k + 1) }
  function handleRenew(member) { setRenewMember(member) }
  function handleRenewClose(renewed) { setRenewMember(null); if (renewed) triggerRefresh() }
  function handleMemberAdded() { triggerRefresh(); setTab('dashboard') }

  const pageProps = { onRenew: handleRenew, refreshKey }

  return (
    <div className="min-h-screen bg-zinc-100 flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 bg-gray-950 fixed inset-y-0 left-0 z-20">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏋️</span>
            <div>
              <p className="text-white font-bold text-base leading-tight">Hanuman Gym</p>
              <p className="text-gray-500 text-xs">Membership Manager</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
                tab === item.id
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon(tab === item.id)}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/5">
          <p className="text-gray-600 text-xs">v1.0 · Hanuman Gym</p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">

        {/* Mobile header */}
        <header className="md:hidden bg-gray-950 text-white px-4 pt-10 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏋️</span>
            <div>
              <p className="font-bold text-base leading-tight">Hanuman Gym</p>
              <p className="text-gray-400 text-xs">Membership Manager</p>
            </div>
          </div>
        </header>

        {/* Desktop page title bar */}
        <div className="hidden md:flex items-center px-6 py-4 bg-white border-b border-gray-100">
          <h1 className="text-base font-bold text-gray-900">
            {NAV.find(n => n.id === tab)?.label}
          </h1>
        </div>

        {/* Page */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {tab === 'dashboard' && <Dashboard {...pageProps} onNavigate={setTab} />}
          {tab === 'members'   && <AllMembers {...pageProps} />}
          {tab === 'add'       && <AddMember onSuccess={handleMemberAdded} />}
          {tab === 'search'    && <Search onRenew={handleRenew} />}
        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
                tab === item.id ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {item.icon(tab === item.id)}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Renew Modal */}
      {renewMember && <RenewModal member={renewMember} onClose={handleRenewClose} />}
    </div>
  )
}
