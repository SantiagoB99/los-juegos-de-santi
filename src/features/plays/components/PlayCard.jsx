import { useNavigate } from 'react-router-dom'
import { MapPin, Trophy } from 'lucide-react'
import { formatDate } from '../../../lib/utils'

export function PlayCard({ play }) {
  const navigate = useNavigate()
  const winners  = play.players.filter(p => p.winner)

  return (
    <div
      onClick={() => navigate(`/juego/${play.bggId}`)}
      className="card p-4 cursor-pointer hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-ludo-brown text-sm truncate">
            {play.gameName}
          </h3>
          <p className="text-xs text-ludo-brown/50 mt-0.5">{formatDate(play.playedAt)}</p>
        </div>
        {play.location && (
          <span className="flex items-center gap-1 text-xs text-ludo-brown/40 shrink-0">
            <MapPin size={11} />{play.location}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {play.players.map((p, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
              p.winner
                ? 'bg-ludo-orange/15 text-ludo-orange font-medium'
                : 'bg-ludo-brown/8 text-ludo-brown/60'
            }`}
          >
            {p.winner && <Trophy size={10} />}
            {p.name}
          </span>
        ))}
      </div>

      {play.notes && (
        <p className="mt-2 text-xs text-ludo-brown/50 italic line-clamp-1">
          "{play.notes}"
        </p>
      )}
    </div>
  )
}
