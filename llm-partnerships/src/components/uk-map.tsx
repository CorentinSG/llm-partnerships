"use client"

import * as React from "react"
import { geoMercator, geoPath } from "d3-geo"

import ukGeojsonRaw from "../../data/uk.json"
import type { FrenchUniversityPoint } from "@/lib/types"
import { translateDataText, type UiLanguage } from "@/lib/text-utils"
import { cn } from "@/lib/utils"
import { usePanZoom } from "@/lib/use-pan-zoom"

const ukGeojson = ukGeojsonRaw as any
const ukFeature = ukGeojson

const markerOffsets: Record<string, { x: number; y: number }> = {
  "King's College London": { x: -38, y: -24 },
  "Queen Mary University of London": { x: 40, y: -18 },
  "University of Greenwich": { x: 38, y: 28 },
  "Middlesex University London": { x: -36, y: 30 },
}

const mapCopy = {
  fr: {
    title: "Carte du Royaume-Uni",
    clear: "Effacer",
    zoomIn: "Zoom avant",
    zoomOut: "Zoom arrière",
    resetZoom: "Réinitialiser le zoom",
    reset: "Reset",
    aria: "Carte du Royaume-Uni avec points des universités",
    selection: "Sélection :",
    tip: "Conseil : clique sur un point pour filtrer la liste (sur mobile : pince pour zoomer).",
  },
  en: {
    title: "Map (United Kingdom)",
    clear: "Clear",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetZoom: "Reset zoom",
    reset: "Reset",
    aria: "Map of the United Kingdom with university points",
    selection: "Selection:",
    tip: "Tip: click a point to filter the list (on mobile: pinch to zoom).",
  },
  es: {
    title: "Mapa (Reino Unido)",
    clear: "Borrar",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    resetZoom: "Restablecer zoom",
    reset: "Reset",
    aria: "Mapa del Reino Unido con puntos universitarios",
    selection: "Selección:",
    tip: "Consejo: toca un punto para filtrar la lista (en móvil: pellizca para ampliar).",
  },
  de: {
    title: "Karte (Vereinigtes Königreich)",
    clear: "Klar",
    zoomIn: "Vergrößern",
    zoomOut: "Herauszoomen",
    resetZoom: "Zoom zurücksetzen",
    reset: "Zurücksetzen",
    aria: "Karte des Vereinigten Königreichs mit Universitätspunkten",
    selection: "Auswahl:",
    tip: "Tipp: Klicken Sie auf einen Punkt, um die Liste zu filtern (auf Mobilgeräten: Zum Zoomen kneifen).",
  },
  it: {
    title: "Mappa (Regno Unito)",
    clear: "Chiaro",
    zoomIn: "Ingrandisci",
    zoomOut: "Rimpicciolisci",
    resetZoom: "Reimposta lo zoom",
    reset: "Reset",
    aria: "Mappa del Regno Unito con punti universitari",
    selection: "Selezione:",
    tip: "Suggerimento: fai clic su un punto per filtrare l'elenco (su dispositivi mobili: pizzica per ingrandire).",
  },
} as const

export function UkMap({
  points,
  selectedUkUniversity,
  onSelect,
  className,
  language = "fr",
}: {
  points: FrenchUniversityPoint[]
  selectedUkUniversity?: string
  onSelect: (university: string | undefined) => void
  className?: string
  language?: UiLanguage
}) {
  const width = 440
  const height = 520
  const padding = 26
  const [hovered, setHovered] = React.useState<string | null>(null)
  const [focused, setFocused] = React.useState<string | null>(null)
  const { transform, bind, controls } = usePanZoom({ minZoom: 1, maxZoom: 6 })
  const copy = mapCopy[language]

  const { svgPath, projectPoint } = React.useMemo(() => {
    const projection = geoMercator()
    if (ukFeature) {
      projection.fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding],
        ],
        ukFeature,
      )
    }
    const pathGen = geoPath(projection)
    const d = ukFeature ? pathGen(ukFeature) : null
    const projectPointLocal = (lat: number, lng: number) => {
      const p = projection([lng, lat]) as [number, number] | null
      if (!p) return { x: width / 2, y: height / 2 }
      return { x: p[0], y: p[1] }
    }
    return { svgPath: d, projectPoint: projectPointLocal }
  }, [width, height, padding])

  const displayPoints = React.useMemo(() => {
    return points.map((p) => {
      const projected = projectPoint(p.coordinates.lat, p.coordinates.lng)
      const offset = markerOffsets[p.frenchUniversity] || { x: 0, y: 0 }
      const x = Math.min(width - padding - 24, Math.max(padding + 24, projected.x + offset.x))
      const y = Math.min(height - padding - 24, Math.max(padding + 24, projected.y + offset.y))
      return { p, x, y, originX: projected.x, originY: projected.y }
    })
  }, [points, projectPoint])

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">{copy.title}</div>
        <button
          type="button"
          className="inline-flex min-h-10 items-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground sm:min-h-0"
          onClick={() => onSelect(undefined)}
        >
          {copy.clear}
        </button>
      </div>

      <div className="glass-panel mt-3 rounded-2xl p-4 motion-rise">
        <div className="relative">
          <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
            <button
              type="button"
              className="glass-button inline-flex h-11 w-11 items-center justify-center rounded-full text-sm text-foreground sm:h-9 sm:w-9"
              onClick={controls.zoomIn}
              aria-label={copy.zoomIn}
            >
              +
            </button>
            <button
              type="button"
              className="glass-button inline-flex h-11 w-11 items-center justify-center rounded-full text-sm text-foreground sm:h-9 sm:w-9"
              onClick={controls.zoomOut}
              aria-label={copy.zoomOut}
            >
              −
            </button>
            <button
              type="button"
              className="glass-button inline-flex h-11 items-center justify-center rounded-full px-4 text-xs text-foreground sm:h-9 sm:px-3"
              onClick={controls.reset}
              aria-label={copy.resetZoom}
            >
              {copy.reset}
            </button>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[320px] w-full sm:h-[380px]"
            role="img"
            aria-label={copy.aria}
            style={{ touchAction: "none" }}
            {...bind}
          >
            <defs>
              <linearGradient id="ukFill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="hsl(var(--muted))" stopOpacity="1" />
                <stop offset="1" stopColor="hsl(var(--muted))" stopOpacity="0.55" />
              </linearGradient>
              <filter id="ukSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="rgba(0,0,0,0.10)" />
              </filter>
            </defs>

            <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
              {svgPath ? (
                <>
                  <path
                    data-uk-land="true"
                    d={svgPath}
                    fill="url(#ukFill)"
                    filter="url(#ukSoftShadow)"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.5"
                    strokeWidth="1.75"
                    vectorEffect="non-scaling-stroke"
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

              {displayPoints.map(({ p, x, y, originX, originY }) => {
                const selected = p.frenchUniversity === selectedUkUniversity
                const isHovered = hovered === p.frenchUniversity
                const isFocused = focused === p.frenchUniversity
                const showLabel = isHovered || isFocused || selected
                const displaced = Math.hypot(x - originX, y - originY) > 2
                const accessibleName = translateDataText(
                  p.frenchUniversity,
                  language,
                )
                return (
                  <g
                    key={p.frenchUniversity}
                    data-panzoom-ignore="true"
                    role="button"
                    tabIndex={0}
                    aria-label={accessibleName}
                    aria-pressed={selected}
                    onClick={() => onSelect(selected ? undefined : p.frenchUniversity)}
                    onMouseEnter={() => setHovered(p.frenchUniversity)}
                    onMouseLeave={() =>
                      setHovered((previous) =>
                        previous === p.frenchUniversity ? null : previous,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onSelect(selected ? undefined : p.frenchUniversity)
                      }
                    }}
                    onFocus={() => setFocused(p.frenchUniversity)}
                    onBlur={() =>
                      setFocused((previous) =>
                        previous === p.frenchUniversity ? null : previous,
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {displaced ? (
                      <>
                        <line
                          data-marker-leader={p.frenchUniversity}
                          x1={originX}
                          y1={originY}
                          x2={x}
                          y2={y}
                          stroke="hsl(var(--primary))"
                          strokeOpacity="0.58"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          vectorEffect="non-scaling-stroke"
                        />
                        <circle
                          data-marker-origin={p.frenchUniversity}
                          cx={originX}
                          cy={originY}
                          r={2.5}
                          fill="hsl(var(--primary))"
                          opacity="0.8"
                        />
                      </>
                    ) : null}
                    {showLabel ? (
                      <g>
                        <rect
                          x={Math.min(width - 230, Math.max(10, x - 110))}
                          y={Math.max(10, y - 42)}
                          width={220}
                          height={30}
                          rx={10}
                          fill="hsl(var(--background))"
                          opacity={0.96}
                          stroke="hsl(var(--border))"
                        />
                        <text
                          x={Math.min(width - 120, Math.max(120, x))}
                          y={y - 21}
                          textAnchor="middle"
                          fontSize="12"
                          fill="hsl(var(--foreground))"
                          style={{ fontWeight: 600 }}
                        >
                          {translateDataText(p.frenchUniversity, language)}
                        </text>
                      </g>
                    ) : null}
                    <circle
                      cx={x}
                      cy={y}
                      r={22}
                      fill="transparent"
                      pointerEvents="all"
                    />
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
                    {isFocused ? (
                      <circle
                        data-focus-ring="true"
                        cx={x}
                        cy={y}
                        r={16}
                        fill="transparent"
                        stroke="hsl(var(--ring))"
                        strokeWidth={3}
                        opacity={0.95}
                      />
                    ) : null}
                  </g>
                )
              })}
            </g>
          </svg>
        </div>
      </div>

      {selectedUkUniversity ? (
        <div className="mt-3 text-sm text-muted-foreground">
          {copy.selection}{" "}
          <span className="font-medium text-foreground">
            {translateDataText(selectedUkUniversity, language)}
          </span>
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">{copy.tip}</div>
      )}
    </div>
  )
}

