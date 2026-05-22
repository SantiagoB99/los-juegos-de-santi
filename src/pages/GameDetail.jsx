import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Clock, Star, Trophy, Plus } from 'lucide-react'
import { useStore } from '../lib/store'
import { getBGGGame } from '../lib/bgg'
import { StatusBadge } from '../components/Badge'
import { Button } from '../components/Button'
import { formatDate } from '../lib/utils'

const STATUS_OPTIONS = [
  { value: 'owned',    label: 'Lo tengo' },
  { value: 'wishlist', label: 'Lo quiero' },
  { value: 'played',   label: 'Lo jugué' },
]

export default function GameDetail() {
  const { bggId } = useParams()
  const navigate  = useNavigate()
  const { games, plays, updateGameStatus } = useStore()

  const savedGame  = games.find(g => g.bggId === bggId)
  const gamePlays  = plays
    .filter(p => p.bggId === bggId)
    .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))

  const [bggData, setBggData]   = useState(savedGame || null)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading]   = useState(!savedGame?.description)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (savedGame?.description) return
    setLoading(true)
    getBGGGame(bggId)
      .then(setBggData)
      .catch(() => setError('No se pudo cargar la info del juego.'))
      .finally(() => setLoading(false))
  }, [bggId])

  const game = bggData || savedGame
  if (!game && loading) return <div className="p-6 text-ludo-brown/50">Cargando…</div>
  if (!game) return <div className="p-6 text-ludo-brown/50">{error || 'Juego no encontrado.'}</div>

  const winCounts = {}
  gamePlays.forEach(p => {
    p.players.filter(pl => pl.winner).forEach(pl => {
      winCounts[pl.name] = (winCounts[pl.name] || 0) + 1
    })
  })
  const topWinner = Object.entries(winCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-ludo-brown/60 hover:text-ludo-brown"
      >
        <ArrowLeft size={14} /> Volver
      </button>

      <div className="card overflow-hidden">
        {game.image && (
          <img src={game.image} alt={game.name} className="w-full h-64 object-contain bg-ludo-beige/40" />
        )}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-ludo-brown">{game.name}</h1>
              {game.yearPublished && <p className="text-sm text-ludo-brown/50">{game.yearPublished}</p>}
            </div>
            {savedGame && <StatusBadge status={savedGame.status} />}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-ludo-brown/60">
            {game.minPlayers && (
              <span className="flex items-center gap-1"><Users size={14}/>{game.minPlayers}–{game.maxPlayers} jugadores</span>
            )}
            {game.playingTime > 0 && (
              <span className="flex items-center gap-1"><Clock size={14}/>{game.playingTime} min</span>
            )}
            {game.bggRating > 0 && (
              <span className="flex items-center gap-1"><Star size={14}/>{game.bggRating}</span>
            )}
            {game.bggRank && (
              <span className="flex items-center gap-1"><Trophy size={14}/>#{game.bggRank} BGG</span>
            )}
          </div>

          {game.description && (
            <div>
              <p className="text-sm text-ludo-brown/70 leading-relaxed whitespace-pre-line">
                {expanded ? game.description : game.description.slice(0, 300) + (game.description.length > 300 ? '…' : '')}
              </p>
              {game.description.length > 300 && (
                <button onClick={() => setExpanded(!expanded)} className="text-sm text-ludo-orange hover:underline mt-1">
                  {expanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          )}

          {savedGame && (
            <div className="flex gap-2 flex-wrap pt-1">
              {STATUS_OPTIONS.filter(o => o.value !== savedGame.status).map(o => (
                <Button key={o.value} variant="secondary" size="sm" onClick={() => updateGameStatus(bggId, o.value)}>
                  {o.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {gamePlays.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4 text-center">
            <div className="font-display text-3xl font-bold text-ludo-orange">{gamePlays.length}</div>
            <div className="text-xs text-ludo-brown/60 mt-1">veces jugado</div>
          </div>
          <div className="card p-4 text-center">
            <div className="font-display text-xl font-bold text-ludo-brown">{topWinner?.[0] || '—'}</div>
            <div className="text-xs text-ludo-brown/60 mt-1">
              {topWinner ? `ganó ${topWinner[1]} ${topWinner[1] === 1 ? 'vez' : 'veces'}` : 'sin ganadores'}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Partidas</h2>
          <Button size="sm" onClick={() => navigate(`/partidas/nueva?juego=${bggId}`)}>
            <Plus size={14} /> Registrar
          </Button>
        </div>
        {gamePlays.length === 0 ? (
          <p className="text-sm text-ludo-brown/50 text-center py-8">
            Todavía no registraste partidas de este juego.
          </p>
        ) : (
          <div className="space-y-2">
            {gamePlays.map(play => (
              <div key={play.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-ludo-brown">{formatDate(play.playedAt)}</p>
                    <p className="text-xs text-ludo-brown/50 mt-0.5">
                      {play.players.map((p, i) => (
                        <span key={i}>{p.winner ? <strong>{p.name} 🏆 </strong> : `${p.name} `}</span>
                      ))}
                    </p>
                  </div>
                  {play.location && (
                    <span className="text-xs text-ludo-brown/40">{play.location}</span>
                  )}
                </div>
                {play.notes && <p className="text-xs text-ludo-brown/60 mt-2 italic">"{play.notes}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
