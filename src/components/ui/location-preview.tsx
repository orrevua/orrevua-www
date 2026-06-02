"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function LocationPreview({
  address,
  embedUrl,
  mapUrl,
}: {
  address: string
  embedUrl: string
  mapUrl: string
}) {
  const [visible, setVisible] = useState(false)
  const showTimer = useRef<number | null>(null)
  const hideTimer = useRef<number | null>(null)

  const onEnter = useCallback(() => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
    showTimer.current = window.setTimeout(() => setVisible(true), 120)
  }, [])

  const onLeave = useCallback(() => {
    if (showTimer.current) {
      window.clearTimeout(showTimer.current)
      showTimer.current = null
    }
    hideTimer.current = window.setTimeout(() => setVisible(false), 120)
  }, [])

  useEffect(() => {
    return () => {
      if (showTimer.current) window.clearTimeout(showTimer.current)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [])

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="cursor-pointer underline decoration-dotted"
      >
        {address}
      </span>

      {visible && (
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="absolute right-0 z-50 bottom-full mb-2 w-72 overflow-hidden rounded border border-border bg-bg-secondary shadow-lg"
        >
          <div className="h-40 w-full">
            <iframe
              src={embedUrl}
              title={`Map preview for ${address}`}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts"
            />
          </div>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-bg-secondary px-2 py-1 text-center text-xs text-text-tertiary hover:text-accent"
          >
            Open in Google Maps
          </a>
        </div>
      )}
    </span>
  )
}
