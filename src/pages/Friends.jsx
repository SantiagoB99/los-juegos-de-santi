import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useFriends } from '../features/friends/hooks/useFriends'
import { useStore } from '../lib/store'
import { FriendsList } from '../features/friends/components/FriendsList'
import { FriendStatsModal } from '../features/friends/components/FriendStatsModal'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'

export default function Friends() {
  const { friendStats, addFriend } = useFriends()
  const removeFriend = useStore(s => s.removeFriend)
  const [selected, setSelected]   = useState(null)
  const [showAdd, setShowAdd]     = useState(false)
  const [newName, setNewName]     = useState('')

  const handleAdd = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    addFriend(trimmed)
    setNewName('')
    setShowAdd(false)
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Amigos</h1>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Agregar
        </Button>
      </div>

      {friendStats.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Todavía no hay amigos"
          description="Agregá a tus rivales de mesa favoritos."
          action={<Button onClick={() => setShowAdd(true)}>Agregar amigo</Button>}
        />
      ) : (
        <FriendsList friends={friendStats} onSelect={setSelected} onRemove={removeFriend} />
      )}

      <FriendStatsModal
        friend={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nuevo amigo" size="sm">
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Nombre…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <Button onClick={handleAdd} disabled={!newName.trim()}>Agregar</Button>
        </div>
      </Modal>
    </div>
  )
}
