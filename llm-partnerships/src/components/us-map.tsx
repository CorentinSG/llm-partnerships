"use client"

import * as React from "react"
import { geoAlbersUsa, geoPath } from "d3-geo"

import usStatesRaw from "../../data/us-states-contiguous.json"
import type { Partnership } from "@/lib/types"
import {
  cleanText,
  translateDataText,
  type UiLanguage,
} from "@/lib/text-utils"
import { cn } from "@/lib/utils"
import { usePanZoom } from "@/lib/use-pan-zoom"

const usStates = usStatesRaw as any

const mapCopy = {
  fr: {
    title: "Carte (États-Unis)",
    clear: "Effacer",
    zoomIn: "Zoom avant",
    zoomOut: "Zoom arrière",
    resetZoom: "Réinitialiser le zoom",
    reset: "Reset",
    aria: "Carte des États-Unis contigus avec états cliquables",
    partnership: "partenariat(s)",
    approximate: "position approximative",
    selectedState: "État sélectionné :",
    tip: "Conseil : clique sur un État avec un chiffre pour filtrer (sur mobile : pince pour zoomer).",
  },
  en: {
    title: "Map (United States)",
    clear: "Clear",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetZoom: "Reset zoom",
    reset: "Reset",
    aria: "Map of the contiguous United States with clickable states",
    partnership: "partnership(s)",
    approximate: "approximate position",
    selectedState: "Selected state:",
    tip: "Tip: click a numbered state to filter (on mobile: pinch to zoom).",
  },
  es: {
    title: "Mapa (Estados Unidos)",
    clear: "Borrar",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    resetZoom: "Restablecer zoom",
    reset: "Reset",
    aria: "Mapa de Estados Unidos continental con estados interactivos",
    partnership: "convenio(s)",
    approximate: "posición aproximada",
    selectedState: "Estado seleccionado:",
    tip: "Consejo: toca un estado con cifra para filtrar (en móvil: pellizca para ampliar).",
  },
  de: {
    title: "Karte (Vereinigte Staaten)",
    clear: "Klar",
    zoomIn: "Vergrößern",
    zoomOut: "Herauszoomen",
    resetZoom: "Zoom zurücksetzen",
    reset: "Zurücksetzen",
    aria: "Karte der angrenzenden Vereinigten Staaten mit anklickbaren Bundesstaaten",
    partnership: "Partnerschaft(en)",
    approximate: "ungefähre Position",
    selectedState: "Ausgewähltes Bundesland:",
    tip: "Tipp: Klicken Sie zum Filtern auf einen nummerierten Bundesstaat (auf Mobilgeräten: Zum Vergrößern zusammenziehen).",
  },
} as const

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
    if (cleanText(p.partnerCountry) !== "États-Unis") continue
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
        count: 1,
      })
  }

  return Array.from(byUni.values()).sort((a, b) =>
    a.partnerUniversity.localeCompare(b.partnerUniversity),
  )
}

export function UsMap({
  partnerships,
  selectedState,
  onSelectState,
  className,
  language = "fr",
}: {
  partnerships: Partnership[]
  selectedState?: string
  onSelectState: (state: string | undefined) => void
  className?: string
  language?: UiLanguage
}) {
  const width = 520
  const height = 340
  const [hovered, setHovered] = React.useState<string | null>(null)
  const [focusedState, setFocusedState] = React.useState<string | null>(null)
  const { transform, bind, controls } = usePanZoom({ minZoom: 1, maxZoom: 6 })
  const copy = mapCopy[language]
  const tr = (value: unknown) => translateDataText(value, language)

  const universities = React.useMemo(
    () => groupPartnerUniversities(partnerships),
    [partnerships],
  )

  const { pathFor, centroidFor, projection } = React.useMemo(() => {
    const proj = geoAlbersUsa()
      .translate([width / 2, height / 2])
      .scale(650)
    const pathGen = geoPath(proj as any)
    const centroid = (feature: any) =>
      pathGen.centroid(feature) as [number, number]
    return {
      projection: proj,
      pathFor: (feature: any) => pathGen(feature) as string,
      centroidFor: centroid,
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
        <div className="text-sm font-medium">{copy.title}</div>
        <button
          type="button"
          className="inline-flex min-h-10 items-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground sm:min-h-0"
          onClick={() => onSelectState(undefined)}
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
            className="h-[260px] w-full sm:h-[300px]"
            role="img"
            aria-label={copy.aria}
            style={{ touchAction: "none" }}
            {...bind}
          >
            <defs>
              <linearGradient id="usFill" x1="0" x2="1" y1="0" y2="1">
                <stop
                  offset="0"
                  stopColor="hsl(var(--muted))"
                  stopOpacity="1"
                />
                <stop
                  offset="1"
                  stopColor="hsl(var(--muted))"
                  stopOpacity="0.55"
                />
              </linearGradient>
            </defs>

            <g
              transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}
            >
              {usStates.features.map((f: any) => {
                const name = String(f.properties?.name || "")
                const selected = Boolean(name && name === selectedState)
                const hasData = stateCounts.has(name)
                const d = pathFor(f)
                const stateLabel = `${tr(name)}${
                  hasData
                    ? ` · ${stateCounts.get(name)} ${copy.partnership}`
                    : ""
                }`
                return (
                  <g
                    key={name}
                    data-panzoom-ignore="true"
                    role="button"
                    tabIndex={0}
                    aria-label={stateLabel}
                    aria-pressed={selected}
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() =>
                      setHovered((prev) => (prev === name ? null : prev))
                    }
                    onClick={() => onSelectState(selected ? undefined : name)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onSelectState(selected ? undefined : name)
                      }
                    }}
                    onFocus={() => setFocusedState(name)}
                    onBlur={() =>
                      setFocusedState((previous) =>
                        previous === name ? null : previous,
                      )
                    }
                    style={{ cursor: hasData ? "pointer" : "default" }}
                  >
                    <path
                      d={d}
                      fill={
                        hasData ? "url(#usFill)" : "hsl(var(--background))"
                      }
                      stroke="hsl(var(--border))"
                      strokeWidth={selected ? 2.5 : 1.2}
                      opacity={hasData ? 1 : 0.5}
                    >
                      <title>{stateLabel}</title>
                    </path>
                    {focusedState === name ? (
                      <path
                        data-focus-ring="true"
                        d={d}
                        fill="transparent"
                        stroke="hsl(var(--ring))"
                        strokeWidth={4}
                        opacity={0.95}
                        pointerEvents="none"
                      />
                    ) : null}
                  </g>
                )
              })}

              {universities.map((u) => {
                const selected = u.partnerState === selectedState
                const base = stateCentroids.get(u.partnerState)
                if (!base) return null

                let x = base.x
                let y = base.y

                if (u.partnerCoordinates) {
                  const p = projection([
                    u.partnerCoordinates.lng,
                    u.partnerCoordinates.lat,
                  ]) as [number, number] | null
                  if (p) {
                    x = p[0]
                    y = p[1]
                  }
                } else {
                  const seed = Array.from(
                    `${u.partnerUniversity}-${u.partnerState}`,
                  ).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
                  const angle = (seed % 360) * (Math.PI / 180)
                  const radius = 10 + (seed % 12)
                  x = base.x + Math.cos(angle) * radius
                  y = base.y + Math.sin(angle) * radius
                }

                const r = selected ? 6.5 : 5.2
                const label = `${tr(u.partnerUniversity)} • ${tr(
                  u.partnerState,
                )}${
                  u.partnerCoordinates ? "" : ` (${copy.approximate})`
                }`
                return (
                  <g
                    key={`${u.partnerUniversity}-${u.partnerState}`}
                    data-panzoom-ignore="true"
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

              {hovered
                ? (() => {
                    const count = stateCounts.get(hovered) || 0
                    const translatedState = tr(hovered)
                    const label = count
                      ? `${translatedState} • ${count}`
                      : translatedState
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
                : null}
            </g>
          </svg>
        </div>
      </div>

      {selectedState ? (
        <div className="mt-3 text-sm text-muted-foreground">
          {copy.selectedState}{" "}
          <span className="font-medium text-foreground">
            {tr(selectedState)}
          </span>
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">{copy.tip}</div>
      )}
    </div>
  )
}
