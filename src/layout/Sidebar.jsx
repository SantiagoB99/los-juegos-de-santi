import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Library, Dices, Users, Settings } from 'lucide-react'

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/coleccion', icon: Library,         label: 'Colección' },
  { to: '/partidas',  icon: Dices,           label: 'Partidas' },
  { to: '/amigos',    icon: Users,           label: 'Amigos' },
  { to: '/ajustes',  icon: Settings,        label: 'Ajustes' },
]

export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 bg-ludo-beige border-r border-ludo-brown/10 min-h-screen">
        <div className="p-5 border-b border-ludo-brown/10">
          <h1 className="font-display text-base font-bold text-ludo-brown leading-tight">
            Los Juegos<br />de Santi
          </h1>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-ludo-orange text-white'
                    : 'text-ludo-brown hover:bg-ludo-brown/8'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ludo-beige border-t border-ludo-brown/10 flex">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-ludo-orange' : 'text-ludo-brown/60'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
