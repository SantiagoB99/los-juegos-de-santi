import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '../../../components/Button'

export function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ludo-brown/40" />
        <input
          className="input pl-9"
          placeholder="Buscá un juego en BoardGameGeek…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      </div>
      <Button type="submit" disabled={!value.trim() || loading}>
        {loading ? 'Buscando…' : 'Buscar'}
      </Button>
    </form>
  )
}
