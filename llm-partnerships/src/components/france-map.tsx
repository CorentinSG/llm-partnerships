"use client"

import * as React from "react"
import { geoMercator, geoPath } from "d3-geo"

import franceGeojsonRaw from "../../data/france-metropolitan.json"
import type { FrenchUniversityPoint } from "@/lib/types"
import { cn } from "@/lib/utils"

const franceGeojson = franceGeojsonRaw as any
const franceFeature = franceGeojson.features?.[0]

export function FranceMap({
  points,
  selectedFrenchUniversity,
  onSelect,
  className
}: {
  points: FrenchUniversityPoint[]
  selectedFrenchUniversity?: string
  onSelect: (frenchUniversity: string | undefined) => void
  className?: string
}) {
  const width = 440
  const height = 520
  const padding = 26
  const [hovered, setHovered] = React.useState<string | null>(null)

  const { svgPath, projectPoint } = React.useMemo(() => {
    const projection = geoMercator()
    // Fit the real France geometry into the viewport with padding.
    if (franceFeature) {
      projection.fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding]
        ],
        franceFeature
      )
    }
    const pathGen = geoPath(projection)
    const d = franceFeature ? pathGen(franceFeature) : null
    const projectPointLocal = (lat: number, lng: number) => {
      const p = projection([lng, lat]) as [number, number] | null
      if (!p) return { x: width / 2, y: height / 2 }
      return { x: p[0], y: p[1] }
    }
    return { svgPath: d, projectPoint: projectPointLocal }
  }, [width, height, padding])

  const displayPoints = React.useMemo(() => {
    // If multiple universities share the same city/coordinates (ex: Lyon 3 and UCLy),
    // their markers would overlap. We apply a small deterministic offset per "stack".
    const keyFor = (x: number, y: number) => `${Math.round(x)}:${Math.round(y)}`
    const counts = new Map<string, number>()

    return points.map((p) => {
      const { x, y } = projectPoint(p.coordinates.lat, p.coordinates.lng)
      const k = keyFor(x, y)
      const idx = counts.get(k) ?? 0
      counts.set(k, idx + 1)

      if (idx === 0) return { p, x, y }

      // Spiral offsets (pixels) for 2nd, 3rd, 4th... points at same location.
      const angle = (idx * 2 * Math.PI) / 6
      const radius = 10 + idx * 3
      return {
        p,
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius
      }
    })
  }, [points, projectPoint])

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">Carte (France)</div>
        <button
          type="button"
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          onClick={() => onSelect(undefined)}
        >
          Effacer
        </button>
      </div>

      <div className="glass-panel mt-3 rounded-3xl p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[380px] w-full"
          role="img"
          aria-label="Carte de France avec points des universités"
        >
          <defs>
            <linearGradient id="frFill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="hsl(var(--muted))" stopOpacity="1" />
              <stop
                offset="1"
                stopColor="hsl(var(--muted))"
                stopOpacity="0.55"
              />
            </linearGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="10"
                floodColor="rgba(0,0,0,0.10)"
              />
            </filter>
          </defs>

          {svgPath ? (
            <>
              <path d={svgPath} fill="url(#frFill)" filter="url(#softShadow)" />
              <path
                d={svgPath}
                fill="transparent"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
            </>
          ) : (
            <rect
              x={padding}
              y={padding}
              width={width - padding * 2}
              height={height - padding * 2}
              rx={24}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
            />
          )}

          {/* subtle meridian-like lines (purely decorative) */}
          <path
            d={`M ${width * 0.5} ${height * 0.12} L ${width * 0.5} ${
              height * 0.88
            }`}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.35"
          />
          <path
            d={`M ${width * 0.22} ${height * 0.48} L ${width * 0.78} ${
              height * 0.48
            }`}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.25"
          />

          {displayPoints.map(({ p, x, y }) => {
            const selected = p.frenchUniversity === selectedFrenchUniversity
            const isHovered = hovered === p.frenchUniversity
            return (
              <g
                key={p.frenchUniversity}
                role="button"
                tabIndex={0}
                onClick={() =>
                  onSelect(selected ? undefined : p.frenchUniversity)
                }
                onMouseEnter={() => setHovered(p.frenchUniversity)}
                onMouseLeave={() => setHovered((prev) => (prev === p.frenchUniversity ? null : prev))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onSelect(selected ? undefined : p.frenchUniversity)
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {isHovered ? (
                  <g>
                    <rect
                      x={Math.max(10, x - 140)}
                      y={Math.max(10, y - 42)}
                      width={280}
                      height={30}
                      rx={10}
                      fill="hsl(var(--background))"
                      opacity={0.96}
                      stroke="hsl(var(--border))"
                    />
                    <text
                      x={x}
                      y={y - 21}
                      textAnchor="middle"
                      fontSize="12"
                      fill="hsl(var(--foreground))"
                      style={{ fontWeight: 600 }}
                    >
                      {p.frenchUniversity}
                    </text>
                  </g>
                ) : null}
                {/* halo */}
                <circle
                  cx={x}
                  cy={y}
                  r={selected ? 14 : isHovered ? 13 : 11}
                  fill="hsl(var(--primary))"
                  opacity={selected ? 0.16 : isHovered ? 0.12 : 0.08}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={selected ? 7 : 5.5}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary))"
                  strokeWidth={selected ? 3 : 2}
                />
                {selected ? (
                  <circle
                    cx={x}
                    cy={y}
                    r={12}
                    fill="transparent"
                    stroke="hsl(var(--ring))"
                    strokeWidth={2}
                    opacity={0.6}
                  />
                ) : null}
              </g>
            )
          })}
        </svg>
      </div>

      {selectedFrenchUniversity ? (
        <div className="mt-3 text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {selectedFrenchUniversity}
          </span>
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">
          Conseil : clique sur un point pour filtrer la liste.
        </div>
      )}
    </div>
  )
}
