"use client"

import * as React from "react"
import { CheckCircle2, Info, Loader2, Mail, ShieldCheck } from "lucide-react"

import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type SubmitStatus = "idle" | "sending" | "success" | "error"

const defaultEndpoint = "https://formspree.io/f/mvzlqvdw"

function cleanValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : ""
}

export function SubmitInformationForm() {
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
      setErrorMessage(
        "Merci de remplir les champs obligatoires avant l’envoi."
      )
      return
    }

    if (!formspreeEndpoint) {
      setStatus("error")
      setErrorMessage(
        "L’envoi email n’est pas configuré pour le moment. Réessaie un peu plus tard."
      )
      return
    }

    formData.set("_subject", `LL.M Database – nouvelle proposition de ${name}`)
    formData.set("sourcePage", "submit-information")

    setStatus("sending")

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      })

      if (!response.ok) {
        let detail = ""
        try {
          const json = (await response.json()) as {
            error?: string
            message?: string
            errors?: { message?: string }[]
          }
          detail =
            json.error ||
            json.message ||
            json.errors?.[0]?.message ||
            ""
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
        error instanceof Error && error.message
          ? error.message
          : "Une erreur est survenue. Réessaie dans un instant."

      setStatus("error")
      setErrorMessage(`Échec de l’envoi : ${message}`)
    }
  }

  return (
    <PageShell
      title="Proposer une information"
      description="Envoie une correction, un complément ou un nouveau partenariat. Le message part directement par email pour relecture avant ajout au site."
    >
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
                    <div className="text-lg font-semibold">
                      Merci, ton message a bien été envoyé.
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Il sera relu avant toute mise à jour du site. Si besoin, je
                      pourrai vérifier la source ou te recontacter à l’adresse indiquée.
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
                  Envoyer une autre information
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
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ton nom"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="frenchUni">Université française concernée</Label>
                  <Input
                    id="frenchUni"
                    name="frenchUni"
                    placeholder="Ex. Paris 1, Assas, Lyon 3…"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerUni">Université partenaire</Label>
                  <Input
                    id="partnerUni"
                    name="partnerUni"
                    placeholder="Ex. Fordham, Georgetown…"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="type">Type d’information proposée</Label>
                  <Input
                    id="type"
                    name="type"
                    placeholder="Ex. frais, TOEFL, sélection, nombre de places, suspension du partenariat…"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Explique précisément l’information à ajouter ou corriger, avec le plus de contexte possible."
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="source">Lien source</Label>
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

                <input type="hidden" name="page" value="Proposer une information" />
                <input type="hidden" name="_language" value="fr" />

                <div className="sm:col-span-2 rounded-xl border bg-secondary/45 p-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4" aria-hidden="true" />
                    <span>
                      Le formulaire envoie un email de proposition. Rien n’est publié
                      automatiquement: chaque information doit être relue avant ajout au site.
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    Champs obligatoires: nom, email, université française, type d’information et message.
                  </div>
                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full sm:w-auto"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Envoi en cours…
                      </>
                    ) : (
                      "Envoyer la proposition"
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
                <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Ce que tu peux envoyer
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Nouveau partenariat LL.M ou correction d’une fiche existante.</p>
                <p>Tests de langue, frais, bourses, places, calendrier ou processus de sélection.</p>
                <p>Suspension d’un accord, mise à jour officielle ou retour étudiant sourcé.</p>
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
                Bonnes pratiques
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Ajoute un lien officiel si tu en as un.</p>
                <p>Si c’est un retour étudiant, précise bien l’année ou la promotion.</p>
                <p>Si une donnée est incertaine, indique-le clairement au lieu de deviner.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
