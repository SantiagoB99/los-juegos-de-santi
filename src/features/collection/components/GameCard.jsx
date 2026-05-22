import { useNavigate } from 'react-router-dom'
import { Trophy, Star } from 'lucide-react'
import { StatusBadge } from '../../../components/Badge'

export function GameCard({ game }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/juego/${game.bggId}`)}
      className="card overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-warm-lg"
    >
      <div className="aspect-square overflow-hidden bg-ludo-beige/50">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-ludo-brown/20">
            🎲
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-display font-semibold text-ludo-brown text-sm leading-tight line-clamp-2">
          {game.name}
        </h3>
        <div className="flex items-center justify-between">
          <StatusBadge status={game.status} />
          <div className="flex items-center gap-2 text-xs text-ludo-brown/50">
            {game.bggRank && (
              <span className="flex items-center gap-0.5">
                <Trophy size={10} />#{game.bggRank}
              </span>
            )}
            {game.bggRating > 0 && (
              <span className="flex items-center gap-0.5">
                <Star size={10} />{game.bggRating}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
