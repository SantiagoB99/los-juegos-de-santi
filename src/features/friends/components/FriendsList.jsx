import { useState } from 'react'
import { Trophy, Trash2 } from 'lucide-react'
import { FriendAvatar } from './FriendAvatar'

export function FriendsList({ friends, onSelect, onRemove }) {
  const [confirmingId, setConfirmingId] = useState(null)

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (confirmingId === id) { onRemove(id); setConfirmingId(null) }
    else setConfirmingId(id)
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    setConfirmingId(null)
  }

  return (
    <div className="space-y-2">
      {friends.map(friend => (
        <button
          key={friend.id}
          onClick={() => onSelect(friend)}
          className="w-full card p-4 flex items-center gap-4 hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-200 text-left"
        >
          <FriendAvatar friend={friend} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-ludo-brown">{friend.name}</p>
            <p className="text-xs text-ludo-brown/50 mt-0.5">
              {friend.playCount} {friend.playCount === 1 ? 'partida' : 'partidas'} juntos
            </p>
          </div>
          <div className="flex items-center gap-3">
            {confirmingId === friend.id ? (
              <div className="flex items-center gap-1">
                <button onClick={(e) => handleDelete(e, friend.id)} className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-0.5 bg-red-50 rounded">
                  ¿Borrar?
                </button>
                <button onClick={handleCancel} className="text-xs text-ludo-brown/40 hover:text-ludo-brown px-1">×</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 text-ludo-orange text-sm font-medium">
                  <Trophy size={14} />{friend.wins}
                </div>
                <button onClick={(e) => handleDelete(e, friend.id)} className="text-ludo-brown/20 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
