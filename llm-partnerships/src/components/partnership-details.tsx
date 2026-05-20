import Link from "next/link"
import {
  BadgeCheck,
  ExternalLink,
  FileText,
  GraduationCap,
  Languages,
  MapPin,
  Users
} from "lucide-react"
import type { ReactNode } from "react"

import { ReliabilityBadge } from "@/components/reliability-badge"
import { TuitionBadges } from "@/components/tuition-badges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Partnership } from "@/lib/types"

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
}

export function PartnershipDetails({ partnership }: { partnership: Partnership }) {
  const tests =
    partnership.languageTests?.length > 0
      ? partnership.languageTests
          .map((t) =>
            t.test === "Non communiquÃ©"
              ? "Non communiquÃ©"
              : t.details
                ? `${t.test} (${t.minimumScore}) â€” ${t.details}`
                : `${t.test} (${t.minimumScore})`
          )
          .join(" â€¢ ")
      : "Non communiquÃ©"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-3">
            <span className="leading-tight">
              {partnership.frenchUniversity} â†” {partnership.partnerUniversity}
            </span>
            <ReliabilityBadge status={partnership.reliabilityStatus} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="FacultÃ©" value={partnership.frenchFaculty} />
            <Field label="Type de programme" value={partnership.programType} />            {partnership.programName ? (
              <Field label="Nom du programme" value={partnership.programName} />
            ) : null}
            <Field
              label="Type de partenariat"
              value={partnership.partnershipType || "Non communiquÃ©"}
            />
            <Field
              label="Candidature"
              value={
                partnership.applicationProcess === "internal"
                  ? "Interne (sÃ©lection par lâ€™universitÃ© franÃ§aise)"
                  : partnership.applicationProcess === "lsac"
                    ? "Plateforme LSAC"
                    : "Non communiquÃ©"
              }
            />
            <Field
              label="Partenaire (pays/continent)"
              value={`${partnership.partnerCountry} â€¢ ${partnership.continent}`}
            />
            <Field label="DurÃ©e" value={partnership.duration} />
            <Field label="Langue" value={partnership.programLanguage} />
            <Field label="Niveau requis" value={String(partnership.requiredLevel)} />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-sm font-medium">RÃ©sumÃ©</div>
            <p className="text-sm text-muted-foreground">
              {partnership.shortDescription}
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Conditions dâ€™admission</div>
            <p className="text-sm text-muted-foreground">
              {partnership.admissionConditions}
            </p>
          </div>

          
          {partnership.degreesAwarded && partnership.degreesAwarded.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Diplômes délivrés</div>
              <div className="space-y-2">
                {partnership.degreesAwarded.map((d) => (
                  <div key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {partnership.nyBarOption?.available ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Option New York Bar</div>
              {partnership.nyBarOption.description ? (
                <p className="text-sm text-muted-foreground">{partnership.nyBarOption.description}</p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                {partnership.nyBarOption.additionalRequirements ? (
                  <Field label="Conditions" value={partnership.nyBarOption.additionalRequirements} />
                ) : null}
                {partnership.nyBarOption.additionalTuition ? (
                  <Field label="Frais supplémentaires" value={partnership.nyBarOption.additionalTuition} />
                ) : null}
              </div>
            </div>
          ) : null}

          {partnership.applicationDocuments && partnership.applicationDocuments.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Pièces à fournir</div>
              <div className="flex flex-wrap gap-2">
                {partnership.applicationDocuments.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border bg-muted/30 px-2 py-1 text-xs text-muted-foreground"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ) : null}<div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Tests de langue"
              value={
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm">{tests}</span>
                </div>
              }
            />
            <Field
              label="Places"
              value={
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>
                    {partnership.availableSeatsDisplay
                      ? partnership.availableSeatsDisplay
                      : String(partnership.availableSeats)}
                  </span>
                </div>
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Frais"
              value={
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <TuitionBadges tuitionCategory={partnership.tuitionCategory} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {partnership.tuitionDisplay || partnership.tuition}
                  </div>
                </div>
              }
            />
            <Field label="Aides financiÃ¨res" value={partnership.financialAid} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="AnnÃ©e de candidature" value={partnership.applicationYear} />
            <Field label="Date limite" value={partnership.applicationDeadline} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Remarques" value={partnership.notes || "Non communiquÃ©"} />
            <Field
              label="Source officielle"
              value={
                partnership.officialLink ? (
                  <Link
                    href={partnership.officialLink}
                    className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Ouvrir
                  </Link>
                ) : (
                  "Non communiquÃ©"
                )
              }
            />
          </div>

          {partnership.attachments && partnership.attachments.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Documents (PDF)</div>
              <div className="space-y-2">
                {partnership.attachments.map((a) => (
                  <div key={`${a.url}-${a.label}`} className="flex flex-col gap-1">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      {a.label}
                    </a>
                    {a.note ? (
                      <div className="text-xs text-muted-foreground">{a.note}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {partnership.missingInformation && partnership.missingInformation.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Champs Ã  complÃ©ter</div>
              <div className="flex flex-wrap gap-2">
                {partnership.missingInformation.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border bg-muted/30 px-2 py-1 text-xs text-muted-foreground"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              Localisation (France)
            </div>
            <div className="text-sm text-muted-foreground">
              {partnership.city} â€¢ {partnership.frenchUniversity}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              SpÃ©cialitÃ©s
            </div>
            <div className="text-sm text-muted-foreground">
              {(partnership.specialties || ["Non communiquÃ©"]).join(" â€¢ ")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


