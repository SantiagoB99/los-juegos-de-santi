import { useState, useCallback } from 'react'
import html2canvas from 'html2canvas'

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function useSharePlay() {
  const [preparing, setPreparing] = useState(false)
  const [shareBlob, setShareBlob] = useState(null)

  const prepareImage = useCallback(async (cardRef) => {
    if (!cardRef?.current) return
    setPreparing(true)
    setShareBlob(null)
    try {
      await document.fonts.ready
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fdf6ee',
        logging: false,
      })
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      if (blob) setShareBlob(blob)
      else console.error('useSharePlay: toBlob returned null')
    } catch (err) {
      console.error('useSharePlay: image generation failed', err)
    } finally {
      setPreparing(false)
    }
  }, [])

  // Must be synchronous — called directly from click handler so iOS treats it
  // as within the user gesture (no async gap before navigator.share)
  const sharePlay = useCallback((play) => {
    if (!shareBlob) return
    const filename = `${play.gameName.replace(/[^a-z0-9]/gi, '_')}.png`
    const file = new File([shareBlob], filename, { type: 'image/png' })

    if (navigator.canShare?.({ files: [file] })) {
      navigator.share({ title: play.gameName, files: [file] })
        .catch(err => {
          if (err?.name !== 'AbortError') downloadBlob(shareBlob, filename)
        })
    } else {
      downloadBlob(shareBlob, filename)
    }
  }, [shareBlob])

  return { preparing, shareBlob, prepareImage, sharePlay }
}
