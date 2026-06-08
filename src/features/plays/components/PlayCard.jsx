import { useState } from 'react'
import { MapPin, Trophy, Trash2 } from 'lucide-react'
import { formatDate } from '../../../lib/utils'
import { useStore } from '../../../lib/store'

export function PlayCard({ play, onOpen }) {
  const removePlay  = useStore(s => s.removePlay)
  const [confirming, setConfirming] = useState(false)

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirming) removePlay(play.id)
    else setConfirming(true)
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    setConfirming(false)
  }

  return (
    <div
      onClick={() => onOpen(play)}
      className="card p-4 cursor-pointer hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-ludo-brown text-sm truncate">
            {play.gameName}
          </h3>
          <p className="text-xs text-ludo-brown/50 mt-0.5">{formatDate(play.playedAt)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {play.location && !confirming && (
            <span className="flex items-center gap-1 text-xs text-ludo-brown/40">
              <MapPin size={11} />{play.location}
            </span>
          )}
          {confirming ? (
            <div className="flex items-center gap-1">
              <button onClick={handleDelete} className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-0.5 bg-red-50 rounded">
                ¿Borrar?
              </button>
              <button onClick={handleCancel} className="text-xs text-ludo-brown/40 hover:text-ludo-brown px-1">×</button>
            </div>
          ) : (
            <button onClick={handleDelete} className="text-ludo-brown/20 hover:text-red-400 transition-colors p-1">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {play.players.map((p, i) => (
          <span key={i} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
            p.winner ? 'bg-ludo-orange/15 text-ludo-orange font-medium' : 'bg-ludo-brown/8 text-ludo-brown/60'
          }`}>
            {p.winner && <Trophy size={10} />}
            {p.name}
          </span>
        ))}
      </div>
      {play.notes && (
        <p className="mt-2 text-xs text-ludo-brown/50 italic line-clamp-1">"{play.notes}"</p>
      )}
    </div>
  )
}
