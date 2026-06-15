import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="min-h-screen flex items-center justify-center bg-ludo-cream p-6">
        <div className="card p-8 text-center space-y-3 max-w-sm">
          <p className="text-4xl">🎲</p>
          <p className="font-display text-lg font-semibold text-ludo-brown">Algo salió mal</p>
          <p className="text-sm text-ludo-brown/60">
            Tus datos están a salvo. Probá recargando la app.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-white bg-ludo-orange hover:bg-ludo-orange/90 rounded-lg transition-colors"
          >
            Recargar la app
          </button>
        </div>
      </div>
    )
  }
}
