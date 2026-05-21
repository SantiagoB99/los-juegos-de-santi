export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-ludo-orange text-white hover:bg-ludo-brown shadow-warm',
    secondary: 'bg-ludo-beige text-ludo-brown hover:bg-ludo-brown/10',
    ghost:     'text-ludo-brown/70 hover:bg-ludo-brown/8',
    danger:    'bg-red-500 text-white hover:bg-red-600',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Spinner({ size = 16 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      className="animate-spin text-current"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
