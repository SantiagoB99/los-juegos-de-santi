import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useStats } from '../features/dashboard/hooks/useStats'
import { StatWidget } from '../features/dashboard/components/StatWidget'
import { PlaysBarChart } from '../features/dashboard/components/PlaysBarChart'
import { RecentPlaysList } from '../features/dashboard/components/RecentPlaysList'
import { FriendsRanking } from '../features/dashboard/components/FriendsRanking'
import { Button } from '../components/Button'

export default function Dashboard() {
  const navigate = useNavigate()
  const stats    = useStats()

  if (!stats.me) return null

  const hasData = stats.totalPlays > 0

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ludo-brown">
          Buen día, <span className="text-ludo-orange">{stats.me.name}</span> 👋
        </h1>
        <Button size="sm" onClick={() => navigate('/partidas/nueva')}>
          <Plus size={14} /> Nueva partida
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatWidget
          label="Colección"
          value={stats.totalGames}
          sub="juegos"
          accent
        />
        <StatWidget
          label="Partidas"
          value={stats.totalPlays}
          sub="registradas"
          dark
        />
        <StatWidget
          label="Tu rendimiento"
          value={`${stats.myWins}`}
          sub={`victorias · ${stats.myWinRate}% de ganadas`}
        />
        <StatWidget
          label="Rival favorito"
          value={stats.favoriteRival?.friend?.name || '—'}
          sub={stats.favoriteRival ? `${stats.favoriteRival.count} partidas juntos` : 'sin partidas aún'}
          olive
        />
      </div>

      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <PlaysBarChart data={stats.playsPerMonth} />
          </div>
          <StatWidget
            label="Top juego"
            value={stats.topGame?.name || '—'}
            sub={stats.topGame ? `${stats.topGame.count} partidas` : ''}
          />
        </div>
      )}

      {stats.recentPlays.length > 0 && (
        <RecentPlaysList plays={stats.recentPlays} />
      )}

      {stats.friendsRanking.length > 0 && (
        <FriendsRanking friends={stats.friendsRanking} />
      )}

      {!hasData && (
        <div className="card p-8 text-center space-y-3">
          <p className="text-4xl">🎲</p>
          <p className="font-display text-lg font-semibold text-ludo-brown">
            Empezá registrando tu primera partida
          </p>
          <p className="text-sm text-ludo-brown/50">
            Las estadísticas van a aparecer una vez que tengas partidas registradas.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Button onClick={() => navigate('/coleccion/buscar')}>Agregar juego</Button>
            <Button variant="secondary" onClick={() => navigate('/partidas/nueva')}>Registrar partida</Button>
          </div>
        </div>
      )}
    </div>
  )
}
