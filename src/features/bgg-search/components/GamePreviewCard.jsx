import { useState } from 'react'
import { Users, Clock, Star, Trophy, ArrowLeft } from 'lucide-react'
import { Button } from '../../../components/Button'
import { StatusBadge } from '../../../components/Badge'
import { useStore } from '../../../lib/store'
import { truncate } from '../../../lib/utils'

const STATUS_OPTIONS = [
  { value: 'owned',    label: 'Lo tengo' },
  { value: 'wishlist', label: 'Lo quiero' },
  { value: 'played',   label: 'Lo jugué' },
]

export function GamePreviewCard({ game, onBack }) {
  const [expanded, setExpanded] = useState(false)
  const { games, addGame, updateGameStatus } = useStore()
  const existing = games.find(g => g.bggId === game.bggId)

  const handleAdd = (status) => {
    addGame({ ...game, status })
  }

  const handleChangeStatus = (status) => {
    updateGameStatus(game.bggId, status)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-ludo-brown/60 hover:text-ludo-brown transition-colors"
      >
        <ArrowLeft size={14} /> Volver a resultados
      </button>

      <div className="card overflow-hidden">
        {game.image && (
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-56 object-contain bg-ludo-beige/50"
          />
        )}
        <div className="p-5 space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-ludo-brown">{game.name}</h2>
            {game.yearPublished && (
              <p className="text-sm text-ludo-brown/50">{game.yearPublished}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-ludo-brown/70">
            {game.minPlayers && (
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {game.minPlayers}–{game.maxPlayers} jugadores
              </span>
            )}
            {game.playingTime > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {game.playingTime} min
              </span>
            )}
            {game.bggRating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star size={14} />
                {game.bggRating}
              </span>
            )}
            {game.bggRank && (
              <span className="flex items-center gap-1.5">
                <Trophy size={14} />
                #{game.bggRank} BGG
              </span>
            )}
          </div>

          {game.description && (
            <div>
              <p className="text-sm text-ludo-brown/70 leading-relaxed">
                {expanded ? game.description : truncate(game.description, 250)}
              </p>
              {game.description.length > 250 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-sm text-ludo-orange hover:underline mt-1"
                >
                  {expanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          )}

          {existing ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-ludo-brown/60">Ya está en tu colección:</span>
                <StatusBadge status={existing.status} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.filter(o => o.value !== existing.status).map(o => (
                  <Button key={o.value} variant="secondary" size="sm" onClick={() => handleChangeStatus(o.value)}>
                    Cambiar a "{o.label}"
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map(o => (
                <Button
                  key={o.value}
                  variant={o.value === 'owned' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleAdd(o.value)}
                >
                  {o.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
