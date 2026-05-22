import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useBGGSearch } from '../features/bgg-search/hooks/useBGGSearch'
import { SearchBar } from '../features/bgg-search/components/SearchBar'
import { SearchResultsList } from '../features/bgg-search/components/SearchResultsList'
import { GamePreviewCard } from '../features/bgg-search/components/GamePreviewCard'

export default function BGGSearch() {
  const navigate = useNavigate()
  const { results, selected, setSelected, loading, error, search, selectGame } = useBGGSearch()

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/coleccion')}
          className="p-2 rounded-lg hover:bg-ludo-brown/8 text-ludo-brown/60 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="page-title">Buscar juego</h1>
      </div>

      {!selected && (
        <>
          <SearchBar onSearch={search} loading={loading} />
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
          <SearchResultsList
            results={results}
            onSelect={selectGame}
            loading={loading && results.length === 0}
          />
        </>
      )}

      {selected && (
        <GamePreviewCard
          game={selected}
          onBack={() => setSelected(null)}
        />
      )}
    </div>
  )
}
