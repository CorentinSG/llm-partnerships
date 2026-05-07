"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { CheckCircle2, Flag, Globe, HelpCircle, School } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
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
  const real = all.filter((p) => !isPlaceholder(p))
  const frenchUniCount = countUnique(all.map((p) => p.frenchUniversity))
  const partnershipCount = real.length
  const countryCount = countUnique(real.map((p) => p.partnerCountry))
  const counts = getReliabilityCounts(real)

  const chartData = [
    { name: "Confirmed", value: counts.confirmed },
    { name: "To confirm", value: counts.to_confirm },
    { name: "Incomplete", value: counts.incomplete }
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1.4fr]">
      <Card>
        <CardContent className="p-4">
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
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Partenariats</div>
              <div className="mt-1 text-2xl font-semibold">{partnershipCount}</div>
            </div>
            <Flag className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Pays partenaires</div>
              <div className="mt-1 text-2xl font-semibold">{countryCount}</div>
            </div>
            <Globe className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
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
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">À confirmer</div>
              <div className="mt-1 text-2xl font-semibold">{counts.to_confirm}</div>
            </div>
            <HelpCircle
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 h-[72px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
