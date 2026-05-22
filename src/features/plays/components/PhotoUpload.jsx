import { useRef } from 'react'
import { Camera, X } from 'lucide-react'

export function PhotoUpload({ preview, onSelect, onClear }) {
  const ref = useRef()

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onSelect(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      {preview ? (
        <div className="relative w-32 h-32">
          <img src={preview} alt="foto" className="w-32 h-32 object-cover rounded-lg border border-ludo-brown/10" />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 bg-white border border-ludo-brown/20 rounded-full p-0.5 text-ludo-brown/60 hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-ludo-brown/20 text-sm text-ludo-brown/60 hover:border-ludo-orange/50 hover:text-ludo-orange transition-colors"
        >
          <Camera size={16} /> Agregar foto
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}
