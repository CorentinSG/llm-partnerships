"use client"

import Link from "next/link"
import {
  BadgeCheck,
  ExternalLink,
  FileText,
  GraduationCap,
  Languages,
  MapPin,
  Users,
} from "lucide-react"
import type { ReactNode } from "react"

import { useLanguage } from "@/components/language-provider"
import { ReliabilityBadge } from "@/components/reliability-badge"
import { TuitionBadges } from "@/components/tuition-badges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Partnership } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { partnershipDetailsCopy } from "@/lib/partnership-details-copy"
import { translateDataText } from "@/lib/text-utils"

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
}

export function PartnershipDetails({
  partnership,
}: {
  partnership: Partnership
}) {
  const { language } = useLanguage()
  const t = partnershipDetailsCopy[language]
  const labels = t.labels
  const tr = (value: unknown) => translateDataText(value, language)
  const isStudentShared = (partnership.sourceType || "").includes(
    "student_shared_unofficial_document",
  )
  const isNanterre =
    partnership.frenchUniversity === "Université Paris Nanterre"
  const studentWarning = isNanterre
    ? t.nanterreWarning
    : t.studentWarning(partnership.frenchUniversity)
  const tests =
    partnership.languageTests?.length > 0
      ? partnership.languageTests
          .map((test) =>
            test.test === "Non communiqué"
              ? t.unknown
              : test.details
                ? `${tr(test.test)} (${tr(test.minimumScore)}) — ${tr(
                    test.details,
                  )}`
                : `${tr(test.test)} (${tr(test.minimumScore)})`,
          )
          .join(" • ")
      : t.unknown

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-3">
            <span className="leading-tight">
              {tr(partnership.frenchUniversity)} ↔{" "}
              {tr(partnership.partnerUniversity)}
            </span>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <ReliabilityBadge
                status={partnership.reliabilityStatus}
                sourceType={partnership.sourceType}
                language={language}
              />
              {isStudentShared ? (
                <Badge
                  variant="outline"
                  className="border-amber-400/30 bg-amber-400/10 text-amber-200"
                >
                  {t.unofficialBadge}
                </Badge>
              ) : null}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isStudentShared ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-muted-foreground">
              {studentWarning}
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={labels.faculty}
              value={tr(partnership.frenchFaculty)}
            />
            <Field
              label={labels.programType}
              value={tr(partnership.programType)}
            />
            {partnership.programName ? (
              <Field
                label={labels.programName}
                value={tr(partnership.programName)}
              />
            ) : null}
            <Field
              label={labels.partnershipType}
              value={
                partnership.partnershipType
                  ? tr(partnership.partnershipType)
                  : t.unknown
              }
            />
            <Field
              label={labels.application}
              value={
                partnership.applicationProcess === "internal"
                  ? t.internal
                  : partnership.applicationProcess === "lsac"
                    ? t.lsac
                    : t.unknown
              }
            />
            <Field
              label={labels.partnerRegion}
              value={`${tr(partnership.partnerCountry)} • ${tr(
                partnership.continent,
              )}`}
            />
            <Field label={labels.duration} value={tr(partnership.duration)} />
            <Field
              label={labels.language}
              value={tr(partnership.programLanguage)}
            />
            <Field
              label={labels.requiredLevel}
              value={tr(partnership.requiredLevel)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-sm font-medium">{labels.summary}</div>
            <p className="text-sm text-muted-foreground">
              {tr(partnership.shortDescription)}
            </p>
          </div>

          {partnership.sourceNote ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">{labels.sourceNote}</div>
              <p className="text-sm text-muted-foreground">
                {tr(partnership.sourceNote)}
              </p>
            </div>
          ) : null}

          {partnership.seatPolicy ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">{labels.seatPolicy}</div>
              {partnership.seatPolicy.description ? (
                <p className="text-sm text-muted-foreground">
                  {tr(partnership.seatPolicy.description)}
                </p>
              ) : null}
              {partnership.seatPolicy.reportedCohortSize ? (
                <p className="text-sm text-muted-foreground">
                  {tr(partnership.seatPolicy.reportedCohortSize)}
                </p>
              ) : null}
            </div>
          ) : null}

          {partnership.admissionSelection ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">{labels.selection}</div>
              {partnership.admissionSelection.selectionBasis ? (
                <p className="text-sm text-muted-foreground">
                  {tr(partnership.admissionSelection.selectionBasis)}
                </p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                {partnership.admissionSelection.internalCandidates ? (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      {labels.internalCandidates}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {partnership.admissionSelection.internalCandidates
                        .program ? (
                        <div>
                          {tr(
                            partnership.admissionSelection.internalCandidates
                              .program,
                          )}
                        </div>
                      ) : null}
                      {partnership.admissionSelection.internalCandidates
                        .oneSemesterNYRequirement ? (
                        <div>
                          {tr(
                            partnership.admissionSelection.internalCandidates
                              .oneSemesterNYRequirement,
                          )}
                        </div>
                      ) : null}
                      {partnership.admissionSelection.internalCandidates
                        .nyBarTrackRequirement ? (
                        <div>
                          {tr(
                            partnership.admissionSelection.internalCandidates
                              .nyBarTrackRequirement,
                          )}
                        </div>
                      ) : null}
                      {partnership.admissionSelection.internalCandidates
                        .note ? (
                        <div>
                          {tr(
                            partnership.admissionSelection.internalCandidates
                              .note,
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {partnership.admissionSelection.externalCandidates ? (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      {labels.externalCandidates}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {typeof partnership.admissionSelection.externalCandidates
                        .accepted === "boolean" ? (
                        <div>
                          {partnership.admissionSelection.externalCandidates
                            .accepted
                            ? t.externalAccepted
                            : t.externalRejected}
                        </div>
                      ) : null}
                      {partnership.admissionSelection.externalCandidates
                        .selectionMethod ? (
                        <div>
                          {tr(
                            partnership.admissionSelection.externalCandidates
                              .selectionMethod,
                          )}
                        </div>
                      ) : null}
                      {partnership.admissionSelection.externalCandidates
                        .requirements ? (
                        <div>
                          {tr(
                            partnership.admissionSelection.externalCandidates
                              .requirements,
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="text-sm font-medium">{labels.admission}</div>
            <p className="text-sm text-muted-foreground">
              {tr(partnership.admissionConditions)}
            </p>
          </div>

          {partnership.degreesAwarded &&
          partnership.degreesAwarded.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">{labels.degrees}</div>
              <div className="space-y-2">
                {partnership.degreesAwarded.map((d) => (
                  <div
                    key={d}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <BadgeCheck
                      className="mt-0.5 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>{tr(d)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {partnership.nyBarOption?.available ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">{labels.nyBar}</div>
              {partnership.nyBarOption.description ? (
                <p className="text-sm text-muted-foreground">
                  {tr(partnership.nyBarOption.description)}
                </p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                {partnership.nyBarOption.additionalRequirements ? (
                  <Field
                    label={labels.conditions}
                    value={tr(partnership.nyBarOption.additionalRequirements)}
                  />
                ) : null}
                {partnership.nyBarOption.additionalTuition ? (
                  <Field
                    label={labels.extraFees}
                    value={tr(partnership.nyBarOption.additionalTuition)}
                  />
                ) : null}
              </div>
            </div>
          ) : null}

          {partnership.applicationDocuments &&
          partnership.applicationDocuments.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">{labels.documents}</div>
              <div className="flex flex-wrap gap-2">
                {partnership.applicationDocuments.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border bg-muted/30 px-2 py-1 text-xs text-muted-foreground"
                  >
                    {tr(d)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={labels.languageTests}
              value={
                <div className="flex items-center gap-2">
                  <Languages
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-sm">{tests}</span>
                </div>
              }
            />
            <Field
              label={labels.seats}
              value={
                <div className="flex items-center gap-2">
                  <Users
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>
                    {partnership.availableSeatsDisplay
                      ? tr(partnership.availableSeatsDisplay)
                      : String(partnership.availableSeats)}
                  </span>
                </div>
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={labels.fees}
              value={
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <TuitionBadges
                      tuitionCategory={partnership.tuitionCategory}
                      language={language}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tr(partnership.tuitionDisplay || partnership.tuition)}
                  </div>
                </div>
              }
            />
            <Field
              label={labels.financialAid}
              value={tr(partnership.financialAid)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={labels.applicationYear}
              value={tr(partnership.applicationYear)}
            />
            <Field
              label={labels.deadline}
              value={tr(partnership.applicationDeadline)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={labels.notes}
              value={partnership.notes ? tr(partnership.notes) : t.unknown}
            />
            <Field
              label={labels.officialSource}
              value={
                partnership.officialLink ? (
                  <Link
                    href={partnership.officialLink}
                    className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    {t.open}
                  </Link>
                ) : (
                  t.unknown
                )
              }
            />
          </div>

          {partnership.attachments && partnership.attachments.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">{labels.pdf}</div>
              <div className="space-y-2">
                {partnership.attachments.map((a) => (
                  <div
                    key={`${a.url}-${a.label}`}
                    className="flex flex-col gap-1"
                  >
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      {tr(a.label)}
                    </a>
                    {a.note ? (
                      <div className="text-xs text-muted-foreground">
                        {tr(a.note)}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {partnership.missingInformation &&
          partnership.missingInformation.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">{labels.missing}</div>
              <div className="flex flex-wrap gap-2">
                {partnership.missingInformation.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border bg-muted/30 px-2 py-1 text-xs text-muted-foreground"
                  >
                    {tr(m)}
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
              <MapPin
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              {labels.location}
            </div>
            <div className="text-sm text-muted-foreground">
              {tr(partnership.city)} • {tr(partnership.frenchUniversity)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GraduationCap
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              {labels.specialties}
            </div>
            <div className="text-sm text-muted-foreground">
              {(partnership.specialties || [t.unknown])
                .map((specialty) => tr(specialty))
                .join(" • ")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
