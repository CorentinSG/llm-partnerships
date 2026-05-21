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

  // Multi-touch pinch zoom (mobile)
  const pointers = React.useRef(new Map<number, { x: number; y: number }>())
  const pinch = React.useRef<{
    active: boolean
    startDistance: number
    startMid: { x: number; y: number }
    startTransform: Transform
  } | null>(null)

  const getTwoPointers = React.useCallback(() => {
    const values = Array.from(pointers.current.values())
    if (values.length < 2) return null
    return [values[0], values[1]] as const
  }, [])

  const startPinchIfPossible = React.useCallback(() => {
    const two = getTwoPointers()
    if (!two) return
    const [a, b] = two
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.hypot(dx, dy)
    if (!Number.isFinite(dist) || dist <= 0) return
    pinch.current = {
      active: true,
      startDistance: dist,
      startMid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      startTransform: { ...t }
    }
    dragging.current = false
    last.current = null
  }, [getTwoPointers, t])

  const onPointerDown = React.useCallback((e: React.PointerEvent<SVGElement>) => {
    // Allow interactive elements inside the SVG (points, states, buttons) to receive clicks.
    const target = e.target as Element | null
    if (target && target.closest('[data-panzoom-ignore="true"]')) return

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    dragging.current = true
    ;(e.currentTarget as SVGElement).setPointerCapture(e.pointerId)
    last.current = { x: e.clientX, y: e.clientY }

    if (pointers.current.size >= 2) startPinchIfPossible()
  }, [startPinchIfPossible])

  const onPointerMove = React.useCallback((e: React.PointerEvent<SVGElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    // Pinch zoom with two fingers.
    if (pinch.current?.active && pointers.current.size >= 2) {
      const two = getTwoPointers()
      if (!two) return
      const [a, b] = two
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      if (!Number.isFinite(dist) || dist <= 0) return

      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      const svg = e.currentTarget
      const rect = svg.getBoundingClientRect()
      const px = mid.x - rect.left
      const py = mid.y - rect.top

      setT(() => {
        const start = pinch.current!.startTransform
        const scale = dist / pinch.current!.startDistance
        const nextK = clamp(start.k * scale, minZoom, maxZoom)

        // Zoom around the pinch midpoint, and keep finger-midpoint translation feeling natural.
        const startPx = pinch.current!.startMid.x - rect.left
        const startPy = pinch.current!.startMid.y - rect.top
        const zoomedX = px - ((startPx - start.x) * nextK) / start.k
        const zoomedY = py - ((startPy - start.y) * nextK) / start.k

        return { x: zoomedX, y: zoomedY, k: nextK }
      })
      return
    }

    // Single pointer pan.
    if (!dragging.current || !last.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    setT((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
  }, [getTwoPointers, maxZoom, minZoom])

  const onPointerUp = React.useCallback((e: React.PointerEvent<SVGElement>) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null

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
