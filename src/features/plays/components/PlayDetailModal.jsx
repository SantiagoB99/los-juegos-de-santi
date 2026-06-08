import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { PlayerRow } from './PlayerRow'
import { PhotoUpload } from './PhotoUpload'
import { getPhoto, savePhoto, deletePhoto } from '../../../lib/db'
import { useStore } from '../../../lib/store'
import { formatDate } from '../../../lib/utils'

export function PlayDetailModal({ play, isOpen, onClose }) {
  const updatePlay = useStore(s => s.updatePlay)
  const [editing, setEditing]   = useState(false)
  const [photo, setPhoto]       = useState(null)
  const [editState, setEditState] = useState(null)

  useEffect(() => {
    if (!isOpen || !play) return
    setEditing(false)
    setEditState(null)
    if (play.photoId) {
      getPhoto(play.photoId).then(data => setPhoto(data || null))
    } else {
      setPhoto(null)
    }
  }, [isOpen, play?.id])

  const startEdit = () => {
    setEditState({
      date: play.playedAt.slice(0, 10),
      location: play.location || '',
      notes: play.notes || '',
      players: play.players.map(p => ({ ...p })),
      photoPreview: photo,
      photoChanged: false,
    })
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setEditState(null)
  }

  const updatePlayer = (idx, field, value) => {
    setEditState(prev => ({
      ...prev,
      players: prev.players.map((p, i) => {
        if (i !== idx) return p
        const updated = { ...p, [field]: value }
        if (field === 'position' && value !== '') updated.winner = value === 1
        return updated
      }),
    }))
  }

  const handleSave = async () => {
    let photoId = play.photoId
    if (editState.photoChanged) {
      if (play.photoId) await deletePhoto(play.photoId)
      photoId = editState.photoPreview ? await savePhoto(editState.photoPreview) : null
    }
    updatePlay(play.id, {
      playedAt: new Date(editState.date).toISOString(),
      location: editState.location.trim() || null,
      notes: editState.notes.trim() || null,
      players: editState.players,
      photoId,
    })
    if (editState.photoChanged) setPhoto(editState.photoPreview)
    setEditing(false)
    setEditState(null)
  }

  if (!play) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={play.gameName} size="lg">
      {editing ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-ludo-brown/60">Fecha</label>
            <input type="date" className="input text-sm" value={editState.date}
              onChange={e => setEditState(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-ludo-brown/60">Lugar</label>
            <input className="input text-sm" placeholder="Casa de Santi…" value={editState.location}
              onChange={e => setEditState(p => ({ ...p, location: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-ludo-brown/60">Jugadores</label>
            {editState.players.map((p, i) => (
              <PlayerRow key={i} player={p} index={i} onChange={updatePlayer} onRemove={() => {}} canRemove={false} />
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-ludo-brown/60">Notas</label>
            <textarea className="input resize-none text-sm" rows={2} value={editState.notes}
              onChange={e => setEditState(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-ludo-brown/60">Foto</label>
            <PhotoUpload
              preview={editState.photoPreview}
              onSelect={data => setEditState(p => ({ ...p, photoPreview: data, photoChanged: true }))}
              onClear={() => setEditState(p => ({ ...p, photoPreview: null, photoChanged: true }))}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button onClick={handleSave} className="flex-1 justify-center">Guardar</Button>
            <Button variant="secondary" onClick={cancelEdit}>Cancelar</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {photo && (
            <img src={photo} alt="foto de partida" className="w-full rounded-lg object-cover max-h-52" />
          )}
          <div className="flex gap-3 text-sm text-ludo-brown/60">
            <span>{formatDate(play.playedAt)}</span>
            {play.location && <span>· {play.location}</span>}
          </div>
          <div className="space-y-1.5">
            {[...play.players].sort((a, b) => {
              if (a.position && b.position) return a.position - b.position
              if (a.position) return -1
              if (b.position) return 1
              return 0
            }).map((p, i) => (
              <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                p.winner ? 'bg-ludo-orange/10' : 'bg-ludo-beige/40'
              }`}>
                {p.winner
                  ? <Trophy size={13} className="text-ludo-orange shrink-0" />
                  : <span className="w-[13px] shrink-0" />
                }
                <span className="flex-1 font-medium text-ludo-brown">{p.name}</span>
                {p.position && <span className="text-ludo-brown/40 text-xs">#{p.position}</span>}
                {p.score && <span className="text-ludo-brown/60 text-xs">{p.score}</span>}
              </div>
            ))}
          </div>
          {play.notes && (
            <p className="text-sm text-ludo-brown/60 italic border-t border-ludo-brown/8 pt-3">
              "{play.notes}"
            </p>
          )}
          <Button variant="secondary" className="w-full justify-center" onClick={startEdit}>
            Editar partida
          </Button>
        </div>
      )}
    </Modal>
  )
}
