export function FriendsRanking({ friends }) {
  if (!friends.length) return null
  const max = Math.max(...friends.map(f => f.wins), 1)

  return (
    <div className="bg-white rounded-xl p-4 shadow-warm border border-ludo-brown/8">
      <p className="text-xs font-medium text-ludo-brown/50 uppercase tracking-wide mb-3">
        Ranking de amigos
      </p>
      <div className="space-y-2.5">
        {friends.map((f, i) => (
          <div key={f.id} className="flex items-center gap-3">
            <span className="w-4 text-xs font-bold text-ludo-orange text-right">{i + 1}</span>
            <span className="text-sm font-medium text-ludo-brown w-24 truncate">{f.name}</span>
            <div className="flex-1 h-1.5 bg-ludo-brown/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-ludo-olive rounded-full"
                style={{ width: `${(f.wins / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-ludo-brown/40 w-14 text-right">
              {f.wins} {f.wins === 1 ? 'vic.' : 'vics.'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
