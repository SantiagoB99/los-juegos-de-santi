import { useState } from 'react'
import { useStore } from '../lib/store'
import { Button } from '../components/Button'

export function OnboardingModal() {
  const [name, setName] = useState('')
  const setMe = useStore((s) => s.setMe)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setMe({ name: trimmed, color: '#C4622D' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ludo-brown/50 backdrop-blur-sm">
      <div className="bg-ludo-cream rounded-2xl shadow-warm-lg p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🎲</div>
        <h1 className="font-display text-2xl font-bold text-ludo-brown mb-2">
          ¡Bienvenido!
        </h1>
        <p className="text-ludo-brown/60 mb-6">
          Antes de empezar, ¿cómo te llamás?
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="input text-center text-lg"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={30}
          />
          <Button type="submit" disabled={!name.trim()} className="w-full justify-center">
            Empezar
          </Button>
        </form>
      </div>
    </div>
  )
}
