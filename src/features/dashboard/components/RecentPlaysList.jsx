import { useNavigate } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { formatRelative } from '../../../lib/utils'

export function RecentPlaysList({ plays }) {
  const navigate = useNavigate()
  if (!plays.length) return null

  return (
    <div className="bg-white rounded-xl shadow-warm border border-ludo-brown/8 overflow-hidden">
      <p className="text-xs font-medium text-ludo-brown/50 uppercase tracking-wide px-4 pt-4 pb-2">
        Últimas partidas
      </p>
      <div className="divide-y divide-ludo-brown/6">
        {plays.map(play => {
          const winners = play.players.filter(p => p.winner).map(p => p.name).join(', ')
          return (
            <button
              key={play.id}
              onClick={() => navigate(`/juego/${play.bggId}`)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-ludo-beige/40 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ludo-brown truncate">{play.gameName}</p>
                <p className="text-xs text-ludo-brown/50 mt-0.5">
                  {play.players.map(p => p.name).join(' · ')}
                </p>
              </div>
              <div className="text-right shrink-0">
                {winners && (
                  <p className="text-xs text-ludo-orange font-medium flex items-center gap-1 justify-end">
                    <Trophy size={10} />{winners}
                  </p>
                )}
                <p className="text-xs text-ludo-brown/40">{formatRelative(play.playedAt)}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
