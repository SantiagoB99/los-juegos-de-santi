import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useStore } from '../../../lib/store'
import { savePhoto } from '../../../lib/db'
import { generateId } from '../../../lib/utils'
import { getBGGGame } from '../../../lib/bgg'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { PlayerRow } from './PlayerRow'
import { PhotoUpload } from './PhotoUpload'

export function PlayForm() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { me, games, friends, addGame, addFriend, addPlay } = useStore()

  const preselectedBggId = params.get('juego')

  const [selectedGame, setSelectedGame] = useState(
    preselectedBggId ? games.find(g => g.bggId === preselectedBggId) || null : null
  )
  const [gameSearch, setGameSearch]     = useState('')
  const [date, setDate]                 = useState(new Date().toISOString().slice(0, 10))
  const [location, setLocation]         = useState('')
  const [notes, setNotes]               = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [players, setPlayers]           = useState([
    { friendId: null, name: me?.name || 'Yo', isMe: true, position: '', score: '', winner: false },
  ])
  const [showFriendModal, setShowFriendModal] = useState(false)
  const [newFriendName, setNewFriendName]     = useState('')
  const [saving, setSaving]                   = useState(false)

  useEffect(() => {
    if (preselectedBggId && !selectedGame) {
      getBGGGame(preselectedBggId).then(setSelectedGame).catch(() => {})
    }
  }, [])

  const filteredGames = games.filter(g =>
    g.name.toLowerCase().includes(gameSearch.toLowerCase())
  )

  const updatePlayer = (idx, field, value) => {
    setPlayers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))
  }

  const removePlayer = (idx) => {
    setPlayers(prev => prev.filter((_, i) => i !== idx))
  }

  const addExistingFriend = (friend) => {
    if (players.some(p => p.friendId === friend.id)) return
    setPlayers(prev => [...prev, {
      friendId: friend.id,
      name: friend.name,
      isMe: false,
      position: '',
      score: '',
      winner: false,
    }])
    setShowFriendModal(false)
  }

  const addNewFriend = () => {
    const trimmed = newFriendName.trim()
    if (!trimmed) return
    setPlayers(prev => [...prev, {
      friendId: `new_${generateId()}`,
      name: trimmed,
      isMe: false,
      position: '',
      score: '',
      winner: false,
      _isNew: true,
    }])
    setNewFriendName('')
    setShowFriendModal(false)
  }

  const handleSave = async () => {
    if (!selectedGame) return
    setSaving(true)
    try {
      const resolvedPlayers = players.map(p => {
        if (p._isNew) {
          const friend = addFriend(p.name)
          const { _isNew, ...rest } = p
          return { ...rest, friendId: friend.id }
        }
        return p
      })

      if (!games.find(g => g.bggId === selectedGame.bggId)) {
        addGame({ ...selectedGame, status: 'played' })
      }

      let photoId = null
      if (photoPreview) {
        photoId = await savePhoto(photoPreview)
      }

      addPlay({
        bggId: selectedGame.bggId,
        gameName: selectedGame.name,
        playedAt: new Date(date).toISOString(),
        location: location.trim() || null,
        notes: notes.trim() || null,
        photoId,
        players: resolvedPlayers,
      })

      navigate('/partidas')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="page-title">Nueva partida</h1>

      {/* Game selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Juego *</label>
        {selectedGame ? (
          <div className="flex items-center justify-between p-3 bg-ludo-beige/60 rounded-lg">
            <span className="font-medium text-ludo-brown text-sm">{selectedGame.name}</span>
            <button onClick={() => setSelectedGame(null)} className="text-xs text-ludo-brown/50 hover:text-ludo-orange">
              Cambiar
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ludo-brown/40" />
              <input
                className="input pl-8 text-sm"
                placeholder="Buscar en mi colección…"
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
              />
            </div>
            {filteredGames.length > 0 && (
              <div className="card max-h-48 overflow-y-auto divide-y divide-ludo-brown/8">
                {filteredGames.map(g => (
                  <button
                    key={g.bggId}
                    type="button"
                    onClick={() => setSelectedGame(g)}
                    className="w-full text-left px-4 py-2 text-sm text-ludo-brown hover:bg-ludo-beige/60 transition-colors"
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Fecha</label>
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Lugar (opcional)</label>
        <input
          className="input"
          placeholder="Casa de Santi…"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Players */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-ludo-brown">Jugadores</label>
        <div className="space-y-2">
          {players.map((p, i) => (
            <PlayerRow
              key={i}
              player={p}
              index={i}
              onChange={updatePlayer}
              onRemove={removePlayer}
              canRemove={!p.isMe}
            />
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => setShowFriendModal(true)}>
          <Plus size={14} /> Agregar jugador
        </Button>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Notas (opcional)</label>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Fede hizo trampa en la ronda 3…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Photo */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Foto (opcional)</label>
        <PhotoUpload
          preview={photoPreview}
          onSelect={setPhotoPreview}
          onClear={() => setPhotoPreview(null)}
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!selectedGame || saving}
          className="flex-1 justify-center"
        >
          {saving ? 'Guardando…' : 'Guardar partida'}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
      </div>

      {/* Friend picker modal */}
      <Modal isOpen={showFriendModal} onClose={() => setShowFriendModal(false)} title="Agregar jugador">
        <div className="space-y-4">
          {friends.length > 0 && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {friends.map(f => (
                <button
                  key={f.id}
                  onClick={() => addExistingFriend(f)}
                  disabled={players.some(p => p.friendId === f.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-ludo-beige/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-left"
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: f.color }}
                  >
                    {f.name[0].toUpperCase()}
                  </span>
                  <span className="text-sm text-ludo-brown">{f.name}</span>
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-ludo-brown/10 pt-3">
            <p className="text-xs text-ludo-brown/50 mb-2">Nuevo amigo</p>
            <div className="flex gap-2">
              <input
                className="input text-sm flex-1"
                placeholder="Nombre…"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNewFriend()}
              />
              <Button size="sm" onClick={addNewFriend} disabled={!newFriendName.trim()}>
                Agregar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
