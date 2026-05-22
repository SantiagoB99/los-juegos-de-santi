import { Trash2, Trophy } from 'lucide-react'

export function PlayerRow({ player, index, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-ludo-beige/40 rounded-lg">
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium text-ludo-brown">{player.name}</p>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            placeholder="Pos."
            value={player.position}
            onChange={(e) => onChange(index, 'position', e.target.value ? parseInt(e.target.value) : '')}
            className="input text-sm w-20"
          />
          <input
            type="text"
            placeholder="Puntaje (ej: 42 puntos)"
            value={player.score}
            onChange={(e) => onChange(index, 'score', e.target.value)}
            className="input text-sm flex-1"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onChange(index, 'winner', !player.winner)}
          title="Marcar ganador"
          className={`p-2 rounded-lg transition-colors ${
            player.winner
              ? 'bg-ludo-orange text-white'
              : 'bg-ludo-brown/8 text-ludo-brown/40 hover:text-ludo-orange'
          }`}
        >
          <Trophy size={14} />
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 rounded-lg text-ludo-brown/30 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
