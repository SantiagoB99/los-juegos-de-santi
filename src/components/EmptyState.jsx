export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {icon && (
        <div className="text-5xl mb-4">{icon}</div>
      )}
      <h3 className="font-display text-xl font-semibold text-ludo-brown mb-2">{title}</h3>
      {description && (
        <p className="text-ludo-brown/60 mb-6 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  )
}
