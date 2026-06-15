import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { OnboardingModal } from './onboarding/OnboardingModal'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useStore } from './lib/store'
import Dashboard  from './pages/Dashboard'
import Collection from './pages/Collection'
import BGGSearch  from './pages/BGGSearch'
import GameDetail from './pages/GameDetail'
import Plays      from './pages/Plays'
import NewPlay    from './pages/NewPlay'
import Friends    from './pages/Friends'
import Settings   from './pages/Settings'

export default function App() {
  const me = useStore((s) => s.me)

  return (
    <HashRouter>
      <ErrorBoundary>
        {!me && <OnboardingModal />}
        <Layout>
          <Routes>
            <Route path="/"                 element={<Dashboard />} />
            <Route path="/coleccion"        element={<Collection />} />
            <Route path="/coleccion/buscar" element={<BGGSearch />} />
            <Route path="/juego/:bggId"     element={<GameDetail />} />
            <Route path="/partidas"         element={<Plays />} />
            <Route path="/partidas/nueva"   element={<NewPlay />} />
            <Route path="/amigos"           element={<Friends />} />
            <Route path="/ajustes"          element={<Settings />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </HashRouter>
  )
}
