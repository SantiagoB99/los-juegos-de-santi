import { Modal } from '../../../components/Modal'
import { FriendAvatar } from './FriendAvatar'

export function FriendStatsModal({ friend, isOpen, onClose }) {
  if (!friend) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={friend.name} size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <FriendAvatar friend={friend} size="lg" />
          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="text-center bg-ludo-beige/50 rounded-lg p-3">
              <div className="font-display text-2xl font-bold text-ludo-brown">{friend.playCount}</div>
              <div className="text-xs text-ludo-brown/50">partidas</div>
            </div>
            <div className="text-center bg-ludo-orange/10 rounded-lg p-3">
              <div className="font-display text-2xl font-bold text-ludo-orange">{friend.wins}</div>
              <div className="text-xs text-ludo-brown/50">victorias</div>
            </div>
          </div>
        </div>

        {friend.topGames.length > 0 && (
          <div>
            <p className="text-xs font-medium text-ludo-brown/50 mb-2">Juegos favoritos</p>
            <div className="space-y-1">
              {friend.topGames.map(g => (
                <div key={g.name} className="flex items-center justify-between text-sm">
                  <span className="text-ludo-brown">{g.name}</span>
                  <span className="text-ludo-brown/40 text-xs">
                    {g.count} {g.count === 1 ? 'vez' : 'veces'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
