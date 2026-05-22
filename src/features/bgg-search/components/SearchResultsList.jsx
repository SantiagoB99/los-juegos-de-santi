import { ChevronRight } from 'lucide-react'

export function SearchResultsList({ results, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12 text-ludo-brown/40">
        Cargando resultados…
      </div>
    )
  }

  if (!results.length) return null

  return (
    <div className="card divide-y divide-ludo-brown/8 overflow-hidden">
      {results.map((r) => (
        <button
          key={r.bggId}
          onClick={() => onSelect(r.bggId)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-ludo-beige/60 transition-colors text-left"
        >
          <div>
            <div className="font-medium text-ludo-brown text-sm">{r.name}</div>
            {r.yearPublished && (
              <div className="text-xs text-ludo-brown/50">{r.yearPublished}</div>
            )}
          </div>
          <ChevronRight size={16} className="text-ludo-brown/30 shrink-0" />
        </button>
      ))}
    </div>
  )
}
