import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Upload, ShieldAlert } from 'lucide-react'
import { useStore } from '../lib/store'
import { exportNow, validateBackup, applyBackup } from '../lib/backup'
import { formatRelative } from '../lib/utils'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'

export default function Settings() {
  const navigate = useNavigate()
  const { games, plays, lastExportAt } = useStore()
  const fileRef = useRef(null)
  const [error, setError]         = useState(null)
  const [pending, setPending]     = useState(null)
  const [busy, setBusy]           = useState(false)

  const handleExport = async () => {
    setBusy(true)
    try { await exportNow() } finally { setBusy(false) }
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setError(null)
    try {
      const json = JSON.parse(await file.text())
      const backup = validateBackup(json)
      if (!backup) {
        setError('Este archivo no parece un backup válido de Los Juegos de Santi.')
        return
      }
      setPending(backup)
    } catch {
      setError('No se pudo leer el archivo. ¿Seguro que es un backup .json?')
    }
  }

  const confirmImport = async () => {
    setBusy(true)
    try {
      await applyBackup(pending)
      setPending(null)
      navigate('/')
    } catch {
      setError('No se pudo importar el backup. Tus datos actuales no se modificaron.')
      setPending(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="page-title">Ajustes</h1>

      <div className="card p-5 space-y-4">
        <h2 className="section-title">Copia de seguridad</h2>
        <p className="text-sm text-ludo-brown/60 leading-relaxed">
          Tus juegos, partidas, amigos y fotos viven únicamente en este navegador.
          Si se borran los datos de navegación, se pierde todo. Exportá un backup
          cada tanto y guardalo en un lugar seguro (Drive, mail, donde quieras).
        </p>

        <div className="space-y-2">
          <Button onClick={handleExport} disabled={busy} className="w-full justify-center">
            <Download size={15} />
            {busy ? 'Generando…' : 'Exportar backup'}
          </Button>
          <p className="text-xs text-ludo-brown/40 text-center">
            {lastExportAt ? `Último backup: ${formatRelative(lastExportAt)}` : 'Nunca hiciste un backup.'}
          </p>
        </div>

        <div className="border-t border-ludo-brown/10 pt-4 space-y-2">
          <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={busy} className="w-full justify-center">
            <Upload size={15} />
            Importar backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFile}
          />
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        </div>
      </div>

      <Modal isOpen={!!pending} onClose={() => setPending(null)} title="Importar backup" size="sm">
        {pending && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <ShieldAlert size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-ludo-brown leading-relaxed">
                Esto va a <strong>reemplazar TODO</strong> lo que hay en este navegador.
              </p>
            </div>
            <div className="text-sm text-ludo-brown/70 space-y-1">
              <p>Ahora tenés: <strong>{plays.length}</strong> partidas y <strong>{games.length}</strong> juegos.</p>
              <p>El backup tiene: <strong>{pending.data.plays.length}</strong> partidas y <strong>{pending.data.games.length}</strong> juegos
                {' '}(del {pending.exportedAt.slice(0, 10)}).</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={confirmImport}
                disabled={busy}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {busy ? 'Importando…' : 'Sí, reemplazar todo'}
              </button>
              <Button variant="secondary" onClick={() => setPending(null)}>Cancelar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
