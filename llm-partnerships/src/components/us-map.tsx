"use client"

import * as React from "react"
import { geoAlbersUsa, geoPath } from "d3-geo"

import usStatesRaw from "../../data/us-states-contiguous.json"
import type { Partnership } from "@/lib/types"
import { cn } from "@/lib/utils"

const usStates = usStatesRaw as any

function groupPartnerUniversities(partnerships: Partnership[]) {
  const byUni = new Map<
    string,
    {
      partnerUniversity: string
      partnerState: string
      partnerCity?: string
      partnerCoordinates?: { lat: number; lng: number }
      count: number
    }
  >()

  for (const p of partnerships) {
    if (p.partnerCountry !== "États-Unis") continue
    const state = p.partnerState || ""
    if (!state) continue
    const key = `${p.partnerUniversity}__${state}`
    const existing = byUni.get(key)
    if (existing) existing.count += 1
    else
      byUni.set(key, {
        partnerUniversity: p.partnerUniversity,
        partnerState: state,
        partnerCity: p.partnerCity,
        partnerCoordinates: p.partnerCoordinates,
        count: 1
      })
  }

  return Array.from(byUni.values()).sort((a, b) =>
    a.partnerUniversity.localeCompare(b.partnerUniversity)
  )
}

export function UsMap({
  partnerships,
  selectedState,
  onSelectState,
  className
}: {
  partnerships: Partnership[]
  selectedState?: string
  onSelectState: (state: string | undefined) => void
  className?: string
}) {
  const width = 520
  const height = 340
  const [hovered, setHovered] = React.useState<string | null>(null)

  const universities = React.useMemo(
    () => groupPartnerUniversities(partnerships),
    [partnerships]
  )

  const { pathFor, centroidFor } = React.useMemo(() => {
    const projection = geoAlbersUsa().translate([width / 2, height / 2]).scale(650)
    const pathGen = geoPath(projection as any)
    const centroid = (feature: any) => pathGen.centroid(feature) as [number, number]
    return {
      pathFor: (feature: any) => pathGen(feature) as string,
      centroidFor: centroid
    }
  }, [width, height])

  const stateCentroids = React.useMemo(() => {
    const map = new Map<string, { x: number; y: number }>()
    for (const f of usStates.features) {
      const name = String(f.properties?.name || "")
      const [x, y] = centroidFor(f)
      map.set(name, { x, y })
    }
    return map
  }, [centroidFor])

  const stateCounts = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const u of universities) {
      map.set(u.partnerState, (map.get(u.partnerState) || 0) + u.count)
    }
    return map
  }, [universities])

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">Carte (États-Unis)</div>
        <button
          type="button"
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          onClick={() => onSelectState(undefined)}
        >
          Effacer
        </button>
      </div>

      <div className="mt-3 rounded-2xl border bg-card p-4 shadow-sm">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[300px] w-full"
          role="img"
          aria-label="Carte des États-Unis (contigus) avec états cliquables"
        >
          <defs>
            <linearGradient id="usFill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="hsl(var(--muted))" stopOpacity="1" />
              <stop offset="1" stopColor="hsl(var(--muted))" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {usStates.features.map((f: any) => {
            const name = String(f.properties?.name || "")
            const selected = name && name === selectedState
            const isHovered = hovered === name
            const hasData = stateCounts.has(name)
            const d = pathFor(f)
            return (
              <path
                key={name}
                d={d}
                fill={hasData ? "url(#usFill)" : "hsl(var(--background))"}
                stroke="hsl(var(--border))"
                strokeWidth={selected ? 2.5 : 1.2}
                opacity={hasData ? 1 : 0.5}
                onMouseEnter={() => setHovered(name)}
                onMouseLeave={() => setHovered((prev) => (prev === name ? null : prev))}
                onClick={() => onSelectState(selected ? undefined : name)}
                style={{ cursor: hasData ? "pointer" : "default" }}
              >
                <title>
                  {name}
                  {hasData ? ` • ${stateCounts.get(name)} partenariat(s)` : ""}
                </title>
              </path>
            )
          })}

          {/* partner university markers (one per partner university) */}
          {universities.map((u) => {
            const selected = u.partnerState === selectedState
            const base = stateCentroids.get(u.partnerState)
            if (!base) return null

            // Position:
            // - exact coords if provided
            // - otherwise, deterministic jitter around state centroid (approx)
            let x = base.x
            let y = base.y

            if (u.partnerCoordinates) {
              // project lon/lat using the same projection
              const proj = geoAlbersUsa()
                .translate([width / 2, height / 2])
                .scale(650)
              const p = proj([u.partnerCoordinates.lng, u.partnerCoordinates.lat]) as
                | [number, number]
                | null
              if (p) {
                x = p[0]
                y = p[1]
              }
            } else {
              const seed = Array.from(`${u.partnerUniversity}-${u.partnerState}`).reduce(
                (acc, ch) => acc + ch.charCodeAt(0),
                0
              )
              const angle = (seed % 360) * (Math.PI / 180)
              const radius = 10 + (seed % 12)
              x = base.x + Math.cos(angle) * radius
              y = base.y + Math.sin(angle) * radius
            }

            const r = selected ? 6.5 : 5.2
            const label = `${u.partnerUniversity} • ${u.partnerState}${
              u.partnerCoordinates ? "" : " (position approximative)"
            }`
            return (
              <g
                key={`${u.partnerUniversity}-${u.partnerState}`}
                onClick={() =>
                  onSelectState(selected ? undefined : u.partnerState)
                }
                onMouseEnter={() => setHovered(u.partnerState)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={r + 7}
                  fill="hsl(var(--primary))"
                  opacity={selected ? 0.18 : 0.1}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary))"
                  strokeWidth={selected ? 3 : 2}
                >
                  <title>{label}</title>
                </circle>
              </g>
            )
          })}

          {/* hover tooltip */}
          {hovered ? (
            (() => {
              const count = stateCounts.get(hovered) || 0
              const label = count ? `${hovered} • ${count}` : hovered
              return (
                <g>
                  <rect
                    x={12}
                    y={12}
                    width={220}
                    height={30}
                    rx={10}
                    fill="hsl(var(--background))"
                    opacity={0.96}
                    stroke="hsl(var(--border))"
                  />
                  <text
                    x={22}
                    y={32}
                    textAnchor="start"
                    fontSize="12"
                    fill="hsl(var(--foreground))"
                    style={{ fontWeight: 600 }}
                  >
                    {label}
                  </text>
                </g>
              )
            })()
          ) : null}
        </svg>
      </div>

      {selectedState ? (
        <div className="mt-3 text-sm text-muted-foreground">
          État sélectionné :{" "}
          <span className="font-medium text-foreground">{selectedState}</span>
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">
          Conseil : clique sur un état (avec un chiffre) pour filtrer.
        </div>
      )}
    </div>
  )
}
