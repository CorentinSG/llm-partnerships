"use client"

import * as React from "react"

type Transform = { x: number; y: number; k: number }

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function usePanZoom({
  minZoom = 1,
  maxZoom = 6
}: {
  minZoom?: number
  maxZoom?: number
} = {}) {
  const [t, setT] = React.useState<Transform>({ x: 0, y: 0, k: 1 })
  const dragging = React.useRef(false)
  const last = React.useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = React.useCallback((e: React.PointerEvent<SVGElement>) => {
    dragging.current = true
    ;(e.currentTarget as SVGElement).setPointerCapture(e.pointerId)
    last.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerMove = React.useCallback((e: React.PointerEvent<SVGElement>) => {
    if (!dragging.current || !last.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    setT((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const onPointerUp = React.useCallback((e: React.PointerEvent<SVGElement>) => {
    dragging.current = false
    last.current = null
    try {
      ;(e.currentTarget as SVGElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }, [])

  const onWheel = React.useCallback(
    (e: React.WheelEvent<SVGElement>) => {
      e.preventDefault()

      const svg = e.currentTarget
      const rect = svg.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top

      setT((prev) => {
        const direction = e.deltaY > 0 ? -1 : 1
        const factor = direction > 0 ? 1.12 : 0.89
        const nextK = clamp(prev.k * factor, minZoom, maxZoom)
        if (nextK === prev.k) return prev

        // Zoom around cursor point in screen space.
        const x = px - ((px - prev.x) * nextK) / prev.k
        const y = py - ((py - prev.y) * nextK) / prev.k
        return { x, y, k: nextK }
      })
    },
    [minZoom, maxZoom]
  )

  const zoomIn = React.useCallback(() => {
    setT((prev) => ({ ...prev, k: clamp(prev.k * 1.12, minZoom, maxZoom) }))
  }, [minZoom, maxZoom])

  const zoomOut = React.useCallback(() => {
    setT((prev) => ({ ...prev, k: clamp(prev.k * 0.89, minZoom, maxZoom) }))
  }, [minZoom, maxZoom])

  const reset = React.useCallback(() => setT({ x: 0, y: 0, k: 1 }), [])

  return {
    transform: t,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onWheel
    },
    controls: { zoomIn, zoomOut, reset }
  }
}

