import { formatDate, getMemberStatus } from '../lib/dates'

const STATUS = {
  overdue: {
    border: 'border-l-red-500',
    avatar: 'bg-red-100 text-red-600',
    badge: 'bg-red-50 text-red-600 ring-1 ring-red-200',
    renew: 'bg-red-600 hover:bg-red-700 text-white',
    label: 'Overdue',
  },
  due_today: {
    border: 'border-l-amber-500',
    avatar: 'bg-amber-100 text-amber-600',
    badge: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
    renew: 'bg-amber-500 hover:bg-amber-600 text-white',
    label: 'Due Today',
  },
  upcoming: {
    border: 'border-l-blue-500',
    avatar: 'bg-blue-100 text-blue-600',
    badge: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
    renew: 'bg-gray-900 hover:bg-gray-700 text-white',
    label: 'Due Soon',
  },
  active: {
    border: 'border-l-emerald-500',
    avatar: 'bg-emerald-100 text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
    renew: 'bg-gray-900 hover:bg-gray-700 text-white',
    label: 'Active',
  },
}

export default function MemberCard({ member, onRenew, showStatus = true }) {
  const { status, overdueDays, daysLeft } = getMemberStatus(member.expiry_date)
  const cfg = STATUS[status]
  const initials = member.name.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase()

  let subLabel = ''
  if (status === 'overdue') subLabel = ` · ${overdueDays}d overdue`
  else if (status === 'due_today') subLabel = ' · Today!'
  else if (status === 'upcoming') subLabel = ` · ${daysLeft}d left`

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-zinc-100 border-l-4 ${cfg.border} p-4 flex items-center gap-3 transition-shadow hover:shadow-md`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${cfg.avatar}`}>
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm leading-tight">{member.name}</span>
          {showStatus && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {cfg.label}{subLabel}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">{member.phone}</p>
        <div className="flex flex-wrap gap-x-2 mt-1 text-xs text-gray-400">
          <span>{member.location}</span>
          <span className="text-gray-200">·</span>
          <span>{member.slot}</span>
          <span className="text-gray-200">·</span>
          <span>{member.plan_duration}d plan</span>
          <span className="text-gray-200">·</span>
          <span>Exp {formatDate(member.expiry_date)}</span>
        </div>
      </div>

      {/* Action */}
      {onRenew && (
        <button
          onClick={() => onRenew(member)}
          className={`flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${cfg.renew}`}
        >
          Renew
        </button>
      )}
    </div>
  )
}
