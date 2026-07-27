"use client"

import { Cell, Pie, PieChart } from "recharts"
import { CheckCircle2, Flag, Globe, HelpCircle, School } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  const { language } = useLanguage()
  const t = {
    fr: {
      frenchUniversities: "Universités françaises",
      universitiesDescription: "Liste des établissements répertoriés.",
      partnerships: "Partenariats",
      partnershipsDescription:
        "Nombre total de partenariats hors fiches à compléter.",
      listed: "partenariat(s) répertorié(s).",
      countries: "Pays partenaires",
      countriesDescription: "Pays couverts par les partenariats.",
      confirmed: "Confirmés",
      confirmedTitle: "Programmes confirmés",
      confirmedDescription:
        "Fiches dont les informations sont suffisamment fiables.",
      none: "Aucun.",
      noneFeminine: "Aucune.",
      toConfirm: "À confirmer",
      toConfirmAria: "Que signifie « À confirmer » ?",
      toConfirmDescription:
        "L’information est probable ou partielle, mais elle n’a pas encore été vérifiée avec une source officielle ou la source est trop ancienne. Elle peut donc changer.",
      viewToConfirm: "Voir la liste des fiches « À confirmer »",
      toConfirmTitle: "Fiches à confirmer",
      toConfirmListDescription:
        "Informations probables ou partielles, mais à vérifier.",
      incomplete: "Incomplets",
    },
    en: {
      frenchUniversities: "French universities",
      universitiesDescription: "List of universities in the directory.",
      partnerships: "Partnerships",
      partnershipsDescription:
        "Total number of partnerships excluding incomplete placeholders.",
      listed: "partnership(s) listed.",
      countries: "Partner countries",
      countriesDescription: "Countries covered by the partnerships.",
      confirmed: "Confirmed",
      confirmedTitle: "Confirmed programs",
      confirmedDescription: "Entries supported by sufficiently reliable data.",
      none: "None.",
      noneFeminine: "None.",
      toConfirm: "To confirm",
      toConfirmAria: "What does “To confirm” mean?",
      toConfirmDescription:
        "The information is likely or partial, but has not yet been verified against an official source, or the source is outdated. It may therefore change.",
      viewToConfirm: "View entries marked “To confirm”",
      toConfirmTitle: "Entries to confirm",
      toConfirmListDescription:
        "Likely or partial information that still requires verification.",
      incomplete: "Incomplete",
    },
    es: {
      frenchUniversities: "Universidades francesas",
      universitiesDescription: "Lista de universidades del directorio.",
      partnerships: "Convenios",
      partnershipsDescription:
        "Número total de convenios, sin contar fichas incompletas.",
      listed: "convenio(s) registrado(s).",
      countries: "Países asociados",
      countriesDescription: "Países cubiertos por los convenios.",
      confirmed: "Confirmados",
      confirmedTitle: "Programas confirmados",
      confirmedDescription: "Fichas con información suficientemente fiable.",
      none: "Ninguno.",
      noneFeminine: "Ninguna.",
      toConfirm: "Por confirmar",
      toConfirmAria: "¿Qué significa «Por confirmar»?",
      toConfirmDescription:
        "La información es probable o parcial, pero aún no se ha verificado con una fuente oficial o la fuente es antigua. Puede cambiar.",
      viewToConfirm: "Ver fichas «Por confirmar»",
      toConfirmTitle: "Fichas por confirmar",
      toConfirmListDescription:
        "Información probable o parcial que todavía debe verificarse.",
      incomplete: "Incompletos",
    },
    de: {
      frenchUniversities: "Französische Universitäten",
      universitiesDescription: "Liste der Universitäten im Verzeichnis.",
      partnerships: "Partnerschaften",
      partnershipsDescription:
        "Gesamtzahl der Partnerschaften ohne unvollständige Platzhalter.",
      listed: "Partnerschaft(en) aufgeführt.",
      countries: "Partnerländer",
      countriesDescription: "Von den Partnerschaften abgedeckte Länder.",
      confirmed: "Bestätigt",
      confirmedTitle: "Bestätigte Programme",
      confirmedDescription: "Einträge durch ausreichend verlässliche Daten gestützt.",
      none: "Keiner.",
      noneFeminine: "Keiner.",
      toConfirm: "Zur Bestätigung",
      toConfirmAria: "Was bedeutet „bestätigen“?",
      toConfirmDescription:
        "Die Informationen sind wahrscheinlich oder unvollständig, wurden jedoch noch nicht anhand einer offiziellen Quelle überprüft oder die Quelle ist veraltet. Es kann sich daher ändern.",
      viewToConfirm: "Einträge mit dem Vermerk „Zur Bestätigung“ anzeigen",
      toConfirmTitle: "Eingaben zur Bestätigung",
      toConfirmListDescription:
        "Wahrscheinliche oder teilweise Informationen, die noch einer Überprüfung bedürfen.",
      incomplete: "Unvollständig",
    },
  }[language]
  const real = all.filter((p) => !isPlaceholder(p))
  const frenchUniCount = countUnique(all.map((p) => p.frenchUniversity))
  const partnershipCount = real.length
  const countryCount = countUnique(real.map((p) => p.partnerCountry))
  const counts = getReliabilityCounts(real)

  const chartData = [
    {
      name: t.confirmed,
      value: counts.confirmed,
      color: "hsl(var(--primary))",
    },
    {
      name: t.toConfirm,
      value: counts.to_confirm,
      color: "hsl(var(--accent))",
    },
    {
      name: t.incomplete,
      value: counts.incomplete,
      color: "hsl(var(--muted-foreground))",
    },
  ].filter((d) => d.value > 0)

  const frenchUniversities = Array.from(
    new Set(all.map((p) => p.frenchUniversity).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b))

  const partnerCountries = Array.from(
    new Set(real.map((p) => p.partnerCountry).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b))

  const confirmedList = real
    .filter((p) => p.reliabilityStatus === "confirmed")
    .map((p) => `${p.frenchUniversity} ↔ ${p.partnerUniversity}`)
    .sort((a, b) => a.localeCompare(b))

  const toConfirmList = real
    .filter((p) => p.reliabilityStatus === "to_confirm")
    .map((p) => `${p.frenchUniversity} ↔ ${p.partnerUniversity}`)
    .sort((a, b) => a.localeCompare(b))

  return (
    <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1.4fr]">
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t.frenchUniversities}
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {frenchUniCount}
                  </div>
                </div>
                <School
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.frenchUniversities}</DialogTitle>
            <DialogDescription>{t.universitiesDescription}</DialogDescription>
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
                  <div className="text-xs text-muted-foreground">
                    {t.partnerships}
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {partnershipCount}
                  </div>
                </div>
                <Flag
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.partnerships}</DialogTitle>
            <DialogDescription>{t.partnershipsDescription}</DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {partnershipCount} {t.listed}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t.countries}
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {countryCount}
                  </div>
                </div>
                <Globe
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.countries}</DialogTitle>
            <DialogDescription>{t.countriesDescription}</DialogDescription>
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
                  <div className="text-xs text-muted-foreground">
                    {t.confirmed}
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {counts.confirmed}
                  </div>
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
            <DialogTitle>{t.confirmedTitle}</DialogTitle>
            <DialogDescription>{t.confirmedDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {confirmedList.length > 0 ? (
              confirmedList.map((line) => (
                <div key={line} className="text-sm text-muted-foreground">
                  {line}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">{t.none}</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Card className="sm:col-span-2 lg:col-span-1">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t.toConfirm}</div>
              <div className="mt-1 text-2xl font-semibold">
                {counts.to_confirm}
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground glass-button"
                  aria-label={t.toConfirmAria}
                >
                  <HelpCircle className="h-5 w-5" aria-hidden="true" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="space-y-2">
                  <div className="text-sm font-medium">{t.toConfirm}</div>
                  <p className="text-sm text-muted-foreground">
                    {t.toConfirmDescription}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-3 flex h-[72px] items-center justify-center status-orbit">
            <PieChart width={132} height={72}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx={66}
                cy={36}
                innerRadius={22}
                outerRadius={34}
                paddingAngle={3}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={1}
                isAnimationActive={false}
              >
                {chartData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="mt-2 w-full rounded-xl px-3 py-2 text-left text-xs text-muted-foreground hover:text-foreground glass-button"
              >
                {t.viewToConfirm}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t.toConfirmTitle}</DialogTitle>
                <DialogDescription>
                  {t.toConfirmListDescription}
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
                  <div className="text-sm text-muted-foreground">
                    {t.noneFeminine}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
