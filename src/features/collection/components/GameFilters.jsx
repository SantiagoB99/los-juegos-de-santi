import { Search } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'all',      label: 'Todos' },
  { value: 'owned',    label: 'Lo tengo' },
  { value: 'wishlist', label: 'Lo quiero' },
  { value: 'played',   label: 'Lo jugué' },
]

const SORT_OPTIONS = [
  { value: 'rank',  label: 'Ranking BGG' },
  { value: 'name',  label: 'Nombre' },
  { value: 'added', label: 'Recién agregado' },
]

export function GameFilters({ search, onSearch, statusFilter, onStatusFilter, sortBy, onSort }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ludo-brown/40" />
        <input
          className="input pl-8 text-sm"
          placeholder="Buscar en mi colección…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <select
        className="input text-sm w-auto"
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value)}
      >
        {STATUS_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select
        className="input text-sm w-auto"
        value={sortBy}
        onChange={(e) => onSort(e.target.value)}
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
