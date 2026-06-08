import { useState } from 'react'
import html2canvas from 'html2canvas'

export function useSharePlay() {
  const [sharing, setSharing]       = useState(false)
  const [shareError, setShareError] = useState(false)

  const sharePlay = async (cardRef, play) => {
    if (!cardRef.current) return
    setSharing(true)
    setShareError(false)

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fdf6ee',
        logging: false,
      })

      const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/png')
      )
      const filename = `${play.gameName.replace(/[^a-z0-9]/gi, '_')}.png`
      const file = new File([blob], filename, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: play.gameName, files: [file] })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setShareError(true)
        setTimeout(() => setShareError(false), 2000)
      }
    } finally {
      setSharing(false)
    }
  }

  return { sharing, shareError, sharePlay }
}
