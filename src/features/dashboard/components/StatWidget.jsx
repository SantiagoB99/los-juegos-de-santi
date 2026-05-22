export function StatWidget({ label, value, sub, accent = false, dark = false, olive = false }) {
  const bg = dark  ? 'bg-ludo-brown text-white'
           : olive ? 'bg-ludo-olive text-white'
           : accent? 'bg-ludo-orange text-white'
           : 'bg-white'
  const muted = (dark || olive || accent) ? 'text-white/70' : 'text-ludo-brown/50'
  const bold  = (dark || olive || accent) ? 'text-white'   : 'text-ludo-brown'

  return (
    <div className={`${bg} rounded-xl p-4 shadow-warm border border-ludo-brown/8`}>
      <p className={`text-xs uppercase tracking-wide font-medium ${muted} mb-1`}>{label}</p>
      <p className={`font-display text-2xl font-bold leading-tight ${bold}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${muted}`}>{sub}</p>}
    </div>
  )
}
