"use client"

import { useEffect, useState } from "react"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer
} from "recharts"
import { CheckCircle2, Flag, Globe, HelpCircle, School } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Partnership } from "@/lib/types"
import { countUnique, getReliabilityCounts } from "@/lib/filters"

function isPlaceholder(p: Partnership) {
  return (
    p.partnerUniversity === "Non communiqué" ||
    p.partnerCountry === "Non communiqué" ||
    p.programType === "À compléter"
  )
}

export function StatsBar({ all }: { all: Partnership[] }) {
  const [isMounted, setIsMounted] = useState(false)
  const real = all.filter((p) => !isPlaceholder(p))
  const frenchUniCount = countUnique(all.map((p) => p.frenchUniversity))
  const partnershipCount = real.length
  const countryCount = countUnique(real.map((p) => p.partnerCountry))
  const counts = getReliabilityCounts(real)

  const chartData = [
    { name: "Confirmés", value: counts.confirmed, color: "hsl(var(--primary))" },
    { name: "À confirmer", value: counts.to_confirm, color: "hsl(var(--accent))" },
    { name: "Incomplets", value: counts.incomplete, color: "hsl(var(--muted-foreground))" }
  ].filter((d) => d.value > 0)

  const frenchUniversities = Array.from(
    new Set(all.map((p) => p.frenchUniversity).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b))

  const partnerCountries = Array.from(
    new Set(real.map((p) => p.partnerCountry).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b))

  const confirmedList = real
    .filter((p) => p.reliabilityStatus === "confirmed")
    .map((p) => `${p.frenchUniversity} ↔ ${p.partnerUniversity}`)
    .sort((a, b) => a.localeCompare(b))

  const toConfirmList = real
    .filter((p) => p.reliabilityStatus === "to_confirm")
    .map((p) => `${p.frenchUniversity} ↔ ${p.partnerUniversity}`)
    .sort((a, b) => a.localeCompare(b))

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1.4fr]">
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer">
            <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">
                Universités françaises
              </div>
              <div className="mt-1 text-2xl font-semibold">{frenchUniCount}</div>
            </div>
            <School className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Universités françaises</DialogTitle>
            <DialogDescription>Liste des établissements répertoriés.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {frenchUniversities.map((u) => (
              <div key={u} className="text-sm text-muted-foreground">
                {u}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer">
            <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Partenariats</div>
              <div className="mt-1 text-2xl font-semibold">{partnershipCount}</div>
            </div>
            <Flag className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Partenariats</DialogTitle>
            <DialogDescription>
              Nombre total de partenariats (hors fiches « à compléter »).
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {partnershipCount} partenariat(s) répertorié(s).
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer">
            <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Pays partenaires</div>
              <div className="mt-1 text-2xl font-semibold">{countryCount}</div>
            </div>
            <Globe className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pays partenaires</DialogTitle>
            <DialogDescription>Pays couverts par les partenariats.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {partnerCountries.map((c) => (
              <div key={c} className="text-sm text-muted-foreground">
                {c}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer">
            <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Confirmés</div>
              <div className="mt-1 text-2xl font-semibold">{counts.confirmed}</div>
            </div>
            <CheckCircle2
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Programmes confirmés</DialogTitle>
            <DialogDescription>
              Fiches dont les informations sont suffisamment fiables.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {confirmedList.length > 0 ? (
              confirmedList.map((line) => (
                <div key={line} className="text-sm text-muted-foreground">
                  {line}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">Aucun.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Card className="sm:col-span-2 lg:col-span-1">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">À confirmer</div>
              <div className="mt-1 text-2xl font-semibold">{counts.to_confirm}</div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground glass-button"
                  aria-label="Que signifie « À confirmer » ?"
                >
                  <HelpCircle className="h-5 w-5" aria-hidden="true" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="space-y-2">
                  <div className="text-sm font-medium">À confirmer</div>
                  <p className="text-sm text-muted-foreground">
                    L’information est <span className="font-medium text-foreground">probable</span>{" "}
                    ou <span className="font-medium text-foreground">partielle</span>, mais elle n’a pas
                    encore été vérifiée avec une source officielle (ou la source est trop ancienne).
                    Elle peut donc changer.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-3 h-[72px]">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={22}
                    outerRadius={34}
                    paddingAngle={3}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={1}
                  >
                    {chartData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-xl bg-primary/10" />
            )}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="mt-2 w-full rounded-xl px-3 py-2 text-left text-xs text-muted-foreground hover:text-foreground glass-button"
              >
                Voir la liste des fiches « À confirmer »
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Fiches à confirmer</DialogTitle>
                <DialogDescription>
                  Informations probables/partielles, mais à vérifier.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                {toConfirmList.length > 0 ? (
                  toConfirmList.map((line) => (
                    <div key={line} className="text-sm text-muted-foreground">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">Aucune.</div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
