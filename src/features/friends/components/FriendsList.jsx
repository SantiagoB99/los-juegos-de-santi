import { Trophy } from 'lucide-react'
import { FriendAvatar } from './FriendAvatar'

export function FriendsList({ friends, onSelect }) {
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
          <div className="flex items-center gap-1 text-ludo-orange text-sm font-medium">
            <Trophy size={14} />
            {friend.wins}
          </div>
        </button>
      ))}
    </div>
  )
}
