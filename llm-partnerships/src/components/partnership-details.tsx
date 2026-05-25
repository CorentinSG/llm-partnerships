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
import { Badge } from "@/components/ui/badge"

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
}

export function PartnershipDetails({ partnership }: { partnership: Partnership }) {
  const isNanterre =
    partnership.frenchUniversity === "Université Paris Nanterre" &&
    (partnership.sourceType || "").includes("student_shared_unofficial_document")
  const tests =
    partnership.languageTests?.length > 0
      ? partnership.languageTests
          .map((t) =>
            t.test === "Non communiqué"
              ? "Non communiqué"
              : t.details
                ? `${t.test} (${t.minimumScore}) — ${t.details}`
                : `${t.test} (${t.minimumScore})`
          )
          .join(" • ")
      : "Non communiqué"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-3">
            <span className="leading-tight">
              {partnership.frenchUniversity} ↔ {partnership.partnerUniversity}
            </span>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <ReliabilityBadge
                status={partnership.reliabilityStatus}
                sourceType={partnership.sourceType}
              />
              {isNanterre ? (
                <Badge
                  variant="outline"
                  className="border-amber-400/30 bg-amber-400/10 text-amber-200"
                >
                  À confirmer – source étudiante non officielle
                </Badge>
              ) : null}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isNanterre ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-muted-foreground">
              Les informations relatives aux partenariats de l’Université Paris Nanterre
              sont issues d’un document étudiant non officiel et peuvent varier selon les
              promotions. Les universités partenaires, le nombre de places, les bourses et
              les modalités doivent être confirmés auprès du master ou de l’université.
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Faculté" value={partnership.frenchFaculty} />
            <Field label="Type de programme" value={partnership.programType} />
            {partnership.programName ? (
              <Field label="Nom du programme" value={partnership.programName} />
            ) : null}
            <Field
              label="Type de partenariat"
              value={partnership.partnershipType || "Non communiqué"}
            />
            <Field
              label="Candidature"
              value={
                partnership.applicationProcess === "internal"
                  ? "Interne (sélection par l’université française)"
                  : partnership.applicationProcess === "lsac"
                    ? "Plateforme LSAC"
                    : "Non communiqué"
              }
            />
            <Field
              label="Partenaire (pays/continent)"
              value={`${partnership.partnerCountry} • ${partnership.continent}`}
            />
            <Field label="Durée" value={partnership.duration} />
            <Field label="Langue" value={partnership.programLanguage} />
            <Field label="Niveau requis" value={String(partnership.requiredLevel)} />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-sm font-medium">Résumé</div>
            <p className="text-sm text-muted-foreground">
              {partnership.shortDescription}
            </p>
          </div>

          {partnership.sourceNote ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Source (note)</div>
              <p className="text-sm text-muted-foreground">{partnership.sourceNote}</p>
            </div>
          ) : null}

          {partnership.seatPolicy ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Politique de places</div>
              {partnership.seatPolicy.description ? (
                <p className="text-sm text-muted-foreground">
                  {partnership.seatPolicy.description}
                </p>
              ) : null}
              {partnership.seatPolicy.reportedCohortSize ? (
                <p className="text-sm text-muted-foreground">
                  {partnership.seatPolicy.reportedCohortSize}
                </p>
              ) : null}
            </div>
          ) : null}

          {partnership.admissionSelection ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Sélection</div>
              {partnership.admissionSelection.selectionBasis ? (
                <p className="text-sm text-muted-foreground">
                  {partnership.admissionSelection.selectionBasis}
                </p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                {partnership.admissionSelection.internalCandidates ? (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Candidats internes
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {partnership.admissionSelection.internalCandidates.program ? (
                        <div>{partnership.admissionSelection.internalCandidates.program}</div>
                      ) : null}
                      {partnership.admissionSelection.internalCandidates.oneSemesterNYRequirement ? (
                        <div>
                          {partnership.admissionSelection.internalCandidates.oneSemesterNYRequirement}
                        </div>
                      ) : null}
                      {partnership.admissionSelection.internalCandidates.nyBarTrackRequirement ? (
                        <div>
                          {partnership.admissionSelection.internalCandidates.nyBarTrackRequirement}
                        </div>
                      ) : null}
                      {partnership.admissionSelection.internalCandidates.note ? (
                        <div>{partnership.admissionSelection.internalCandidates.note}</div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {partnership.admissionSelection.externalCandidates ? (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Candidats externes
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {typeof partnership.admissionSelection.externalCandidates.accepted ===
                      "boolean" ? (
                        <div>
                          {partnership.admissionSelection.externalCandidates.accepted
                            ? "Candidatures extérieures acceptées"
                            : "Candidatures extérieures non acceptées"}
                        </div>
                      ) : null}
                      {partnership.admissionSelection.externalCandidates.selectionMethod ? (
                        <div>{partnership.admissionSelection.externalCandidates.selectionMethod}</div>
                      ) : null}
                      {partnership.admissionSelection.externalCandidates.requirements ? (
                        <div>{partnership.admissionSelection.externalCandidates.requirements}</div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="text-sm font-medium">Conditions d’admission</div>
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
            <Field label="Aides financières" value={partnership.financialAid} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Année de candidature" value={partnership.applicationYear} />
            <Field label="Date limite" value={partnership.applicationDeadline} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Remarques" value={partnership.notes || "Non communiqué"} />
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
                  "Non communiqué"
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
              <div className="text-sm font-medium">Champs à compléter</div>
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
              {partnership.city} • {partnership.frenchUniversity}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              Spécialités
            </div>
            <div className="text-sm text-muted-foreground">
              {(partnership.specialties || ["Non communiqué"]).join(" • ")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


