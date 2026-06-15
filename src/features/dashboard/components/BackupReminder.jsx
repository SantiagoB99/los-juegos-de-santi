import { useState } from 'react'
import { X, Download } from 'lucide-react'
import { useStore } from '../../../lib/store'
import { exportNow } from '../../../lib/backup'

const DAY_MS = 24 * 60 * 60 * 1000

export function BackupReminder() {
  const { plays, lastExportAt, playsAtLastExport, reminderDismissedAt, dismissBackupReminder } = useStore()
  const [busy, setBusy] = useState(false)

  const now = Date.now()
  const dismissed = reminderDismissedAt && (now - new Date(reminderDismissedAt).getTime()) < 7 * DAY_MS
  const neverExported = !lastExportAt && plays.length >= 5
  const stale = lastExportAt
    && (now - new Date(lastExportAt).getTime()) > 30 * DAY_MS
    && plays.length !== playsAtLastExport

  if (dismissed || (!neverExported && !stale)) return null

  const handleExport = async () => {
    setBusy(true)
    try { await exportNow() } finally { setBusy(false) }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-ludo-orange/10 border border-ludo-orange/20 rounded-xl">
      <span className="text-lg">📦</span>
      <p className="flex-1 text-sm text-ludo-brown">
        {neverExported
          ? 'Tus partidas viven solo en este navegador. Hacé un backup por las dudas.'
          : 'Hace más de un mes que no hacés backup de tus partidas.'}
      </p>
      <button
        onClick={handleExport}
        disabled={busy}
        className="text-sm font-medium text-ludo-orange hover:underline shrink-0 disabled:opacity-50"
      >
        <span className="flex items-center gap-1">
          <Download size={13} />
          {busy ? 'Generando…' : 'Hacer backup'}
        </span>
      </button>
      <button onClick={dismissBackupReminder} className="text-ludo-brown/30 hover:text-ludo-brown p-1">
        <X size={15} />
      </button>
    </div>
  )
}
