"use client"

import * as React from "react"
import { CheckCircle2, Info, Loader2, Mail, ShieldCheck } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type SubmitStatus = "idle" | "sending" | "success" | "error"

const defaultEndpoint = "https://formspree.io/f/mvzlqvdw"

const copy = {
  fr: {
    title: "Proposer une information",
    description:
      "Envoie une correction, un complément ou un nouveau partenariat. Le message part directement par email pour relecture avant ajout au site.",
    requiredError: "Merci de remplir les champs obligatoires avant l’envoi.",
    configError:
      "L’envoi email n’est pas configuré pour le moment. Réessaie un peu plus tard.",
    genericError: "Une erreur est survenue. Réessaie dans un instant.",
    sendError: "Échec de l’envoi",
    success: "Merci, ton message a bien été envoyé.",
    successDetail:
      "Il sera relu avant toute mise à jour du site. Si besoin, je pourrai vérifier la source ou te recontacter à l’adresse indiquée.",
    another: "Envoyer une autre information",
    name: "Nom",
    namePlaceholder: "Ton nom",
    email: "Email",
    frenchUniversity: "Université française concernée",
    frenchUniversityPlaceholder: "Ex. Paris 1, Assas, Lyon 3…",
    partnerUniversity: "Université partenaire",
    partnerUniversityPlaceholder: "Ex. Fordham, Georgetown…",
    type: "Type d’information proposée",
    typePlaceholder:
      "Ex. frais, TOEFL, sélection, nombre de places, suspension du partenariat…",
    message: "Message",
    messagePlaceholder:
      "Explique précisément l’information à ajouter ou corriger, avec le plus de contexte possible.",
    source: "Lien source",
    mailNotice:
      "Le formulaire envoie un email de proposition. Rien n’est publié automatiquement : chaque information doit être relue avant ajout au site.",
    required:
      "Champs obligatoires : nom, email, université française, type d’information et message.",
    sending: "Envoi en cours…",
    submit: "Envoyer la proposition",
    canSend: "Ce que tu peux envoyer",
    sendItems: [
      "Nouveau partenariat LL.M ou correction d’une fiche existante.",
      "Tests de langue, frais, bourses, places, calendrier ou processus de sélection.",
      "Suspension d’un accord, mise à jour officielle ou retour étudiant sourcé.",
    ],
    practices: "Bonnes pratiques",
    practiceItems: [
      "Ajoute un lien officiel si tu en as un.",
      "Pour un retour étudiant, précise l’année ou la promotion.",
      "Si une donnée est incertaine, indique-le clairement au lieu de deviner.",
    ],
  },
  en: {
    title: "Submit information",
    description:
      "Send a correction, additional detail, or new partnership. The message is emailed for review before anything is added to the website.",
    requiredError: "Please complete all required fields before submitting.",
    configError:
      "Email submission is not configured at the moment. Please try again later.",
    genericError: "Something went wrong. Please try again in a moment.",
    sendError: "Submission failed",
    success: "Thank you, your message was sent.",
    successDetail:
      "It will be reviewed before the website is updated. I may verify the source or contact you at the email address provided.",
    another: "Submit another item",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    frenchUniversity: "French university concerned",
    frenchUniversityPlaceholder: "e.g. Paris 1, Assas, Lyon 3",
    partnerUniversity: "Partner university",
    partnerUniversityPlaceholder: "e.g. Fordham, Georgetown",
    type: "Type of information",
    typePlaceholder:
      "e.g. tuition, TOEFL, selection, available seats, suspended agreement",
    message: "Message",
    messagePlaceholder:
      "Explain precisely what should be added or corrected, with as much context as possible.",
    source: "Source link",
    mailNotice:
      "The form sends a proposal by email. Nothing is published automatically: every submission is reviewed before being added.",
    required:
      "Required fields: name, email, French university, information type, and message.",
    sending: "Sending…",
    submit: "Send proposal",
    canSend: "What you can submit",
    sendItems: [
      "A new LL.M partnership or correction to an existing entry.",
      "Language tests, tuition, scholarships, seats, dates, or selection process.",
      "Suspended agreements, official updates, or sourced student feedback.",
    ],
    practices: "Good practices",
    practiceItems: [
      "Add an official link whenever possible.",
      "For student feedback, specify the year or cohort.",
      "Clearly mark uncertain information instead of guessing.",
    ],
  },
  es: {
    title: "Proponer información",
    description:
      "Envía una corrección, información adicional o un nuevo convenio. El mensaje se revisa por email antes de añadirlo al sitio.",
    requiredError: "Completa los campos obligatorios antes de enviar.",
    configError:
      "El envío por email no está configurado en este momento. Inténtalo más tarde.",
    genericError: "Se ha producido un error. Inténtalo de nuevo.",
    sendError: "Error de envío",
    success: "Gracias, tu mensaje se ha enviado.",
    successDetail:
      "Se revisará antes de actualizar el sitio. Puede que verifique la fuente o te contacte en la dirección indicada.",
    another: "Enviar otra información",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Email",
    frenchUniversity: "Universidad francesa",
    frenchUniversityPlaceholder: "Ej. Paris 1, Assas, Lyon 3",
    partnerUniversity: "Universidad asociada",
    partnerUniversityPlaceholder: "Ej. Fordham, Georgetown",
    type: "Tipo de información",
    typePlaceholder:
      "Ej. matrícula, TOEFL, selección, plazas, suspensión del convenio",
    message: "Mensaje",
    messagePlaceholder:
      "Explica con precisión la información que debe añadirse o corregirse.",
    source: "Enlace de la fuente",
    mailNotice:
      "El formulario envía una propuesta por email. Nada se publica automáticamente: cada información se revisa antes de añadirse.",
    required:
      "Campos obligatorios: nombre, email, universidad francesa, tipo de información y mensaje.",
    sending: "Enviando…",
    submit: "Enviar propuesta",
    canSend: "Qué puedes enviar",
    sendItems: [
      "Un nuevo convenio LL.M o una corrección de una ficha existente.",
      "Pruebas de idioma, matrícula, becas, plazas, calendario o selección.",
      "Suspensión de un acuerdo, actualización oficial o experiencia estudiantil documentada.",
    ],
    practices: "Buenas prácticas",
    practiceItems: [
      "Añade un enlace oficial si lo tienes.",
      "Para una experiencia estudiantil, indica el año o la promoción.",
      "Marca claramente los datos inciertos en lugar de adivinarlos.",
    ],
  },
} as const

function cleanValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : ""
}

export function SubmitInformationForm() {
  const { language } = useLanguage()
  const t = copy[language]
  const [submitted, setSubmitted] = React.useState(false)
  const [status, setStatus] = React.useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = React.useState("")

  const formRef = React.useRef<HTMLFormElement | null>(null)

  const formspreeEndpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || defaultEndpoint

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")

    const form = event.currentTarget
    const formData = new FormData(form)

    const website = cleanValue(formData.get("website"))
    if (website) {
      setStatus("success")
      setSubmitted(true)
      form.reset()
      return
    }

    const name = cleanValue(formData.get("name"))
    const email = cleanValue(formData.get("email"))
    const frenchUniversity = cleanValue(formData.get("frenchUni"))
    const infoType = cleanValue(formData.get("type"))
    const message = cleanValue(formData.get("message"))

    if (!name || !email || !frenchUniversity || !infoType || !message) {
      setStatus("error")
      setErrorMessage(t.requiredError)
      return
    }

    if (!formspreeEndpoint) {
      setStatus("error")
      setErrorMessage(t.configError)
      return
    }

    formData.set("_subject", `LL.M Database – nouvelle proposition de ${name}`)
    formData.set("sourcePage", "submit-information")

    setStatus("sending")

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })

      if (!response.ok) {
        let detail = ""
        try {
          const json = (await response.json()) as {
            error?: string
            message?: string
            errors?: { message?: string }[]
          }
          detail = json.error || json.message || json.errors?.[0]?.message || ""
        } catch {
          detail = ""
        }

        throw new Error(detail || `HTTP ${response.status}`)
      }

      setStatus("success")
      setSubmitted(true)
      form.reset()
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : t.genericError

      setStatus("error")
      setErrorMessage(`${t.sendError}: ${message}`)
    }
  }

  return (
    <PageShell title={t.title} description={t.description}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="p-5 sm:p-6">
            {submitted && status === "success" ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 text-emerald-400"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">{t.success}</div>
                    <p className="text-sm text-muted-foreground">
                      {t.successDetail}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSubmitted(false)
                    setStatus("idle")
                    setErrorMessage("")
                    formRef.current?.reset()
                  }}
                >
                  {t.another}
                </Button>
              </div>
            ) : (
              <form
                ref={formRef}
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="space-y-2">
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder={t.namePlaceholder}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ton@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frenchUni">{t.frenchUniversity}</Label>
                  <Input
                    id="frenchUni"
                    name="frenchUni"
                    placeholder={t.frenchUniversityPlaceholder}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerUni">{t.partnerUniversity}</Label>
                  <Input
                    id="partnerUni"
                    name="partnerUni"
                    placeholder={t.partnerUniversityPlaceholder}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="type">{t.type}</Label>
                  <Input
                    id="type"
                    name="type"
                    placeholder={t.typePlaceholder}
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="message">{t.message}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t.messagePlaceholder}
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="source">{t.source}</Label>
                  <Input
                    id="source"
                    name="source"
                    type="url"
                    inputMode="url"
                    placeholder="https://…"
                  />
                </div>

                <div className="hidden" aria-hidden="true">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <input type="hidden" name="page" value={t.title} />
                <input type="hidden" name="_language" value={language} />

                <div className="sm:col-span-2 rounded-xl border bg-secondary/45 p-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4" aria-hidden="true" />
                    <span>{t.mailNotice}</span>
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    {t.required}
                  </div>
                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full sm:w-auto"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2
                          className="mr-2 h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        {t.sending}
                      </>
                    ) : (
                      t.submit
                    )}
                  </Button>
                </div>

                {status === "error" ? (
                  <div className="sm:col-span-2 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">
                    {errorMessage}
                  </div>
                ) : null}
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Info
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                {t.canSend}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {t.sendItems.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                {t.practices}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {t.practiceItems.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
