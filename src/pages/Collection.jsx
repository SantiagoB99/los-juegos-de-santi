import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCollection } from '../features/collection/hooks/useCollection'
import { GameCard } from '../features/collection/components/GameCard'
import { GameFilters } from '../features/collection/components/GameFilters'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'

export default function Collection() {
  const navigate = useNavigate()
  const {
    filtered, search, setSearch,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
  } = useCollection()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Mi colección</h1>
        <Button onClick={() => navigate('/coleccion/buscar')}>
          <Plus size={16} /> Agregar
        </Button>
      </div>

      <GameFilters
        search={search}
        onSearch={setSearch}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        sortBy={sortBy}
        onSort={setSortBy}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🎲"
          title="Todavía no tenés juegos"
          description="Buscá en BoardGameGeek y agregá tu primer juego."
          action={
            <Button onClick={() => navigate('/coleccion/buscar')}>
              Buscar mi primer juego
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(game => (
            <GameCard key={game.bggId} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
