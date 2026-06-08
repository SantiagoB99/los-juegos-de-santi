import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { usePlays } from '../features/plays/hooks/usePlays'
import { PlayCard } from '../features/plays/components/PlayCard'
import { PlayDetailModal } from '../features/plays/components/PlayDetailModal'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'

export default function Plays() {
  const navigate = useNavigate()
  const { plays } = usePlays()
  const [selectedPlay, setSelectedPlay] = useState(null)

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Partidas</h1>
        <Button onClick={() => navigate('/partidas/nueva')}>
          <Plus size={16} /> Nueva
        </Button>
      </div>

      {plays.length === 0 ? (
        <EmptyState
          icon="🃏"
          title="Todavía no hay partidas"
          description="Registrá tu primera partida para empezar a llevar el historial."
          action={
            <Button onClick={() => navigate('/partidas/nueva')}>
              Registrar primera partida
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {plays.map(play => (
            <PlayCard key={play.id} play={play} onOpen={setSelectedPlay} />
          ))}
        </div>
      )}

      <PlayDetailModal
        play={selectedPlay}
        isOpen={!!selectedPlay}
        onClose={() => setSelectedPlay(null)}
      />
    </div>
  )
}
