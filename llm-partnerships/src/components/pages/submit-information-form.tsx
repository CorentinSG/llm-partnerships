"use client"

import * as React from "react"

import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function SubmitInformationForm() {
  const [submitted, setSubmitted] = React.useState(false)
  const [status, setStatus] = React.useState<
    "idle" | "sending" | "success" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  const formspreeEndpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || ""

  return (
    <PageShell
      title="Proposer une information"
      description="Propose une correction ou une nouvelle information. Ce MVP ne stocke rien encore : il affiche uniquement une confirmation côté frontend."
    >
      <Card>
        <CardContent className="p-6">
          {submitted && status === "success" ? (
            <div className="space-y-2">
              <div className="text-lg font-semibold">Merci.</div>
              <p className="text-sm text-muted-foreground">
                Ton message est bien pris en compte par ce MVP (sans stockage).
                Prochaine étape : connexion à un backend ou un workflow email.
              </p>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={async (e) => {
                e.preventDefault()
                setErrorMessage("")

                if (!formspreeEndpoint) {
                  setStatus("error")
                  setErrorMessage(
                    "Envoi email non configuré. Ajoute NEXT_PUBLIC_FORMSPREE_ENDPOINT (Formspree) dans Vercel / .env."
                  )
                  return
                }

                const form = e.currentTarget
                const formData = new FormData(form)

                setStatus("sending")
                try {
                  const res = await fetch(formspreeEndpoint, {
                    method: "POST",
                    headers: { Accept: "application/json" },
                    body: formData
                  })

                  if (!res.ok) {
                    let detail = ""
                    try {
                      const json = (await res.json()) as any
                      detail = json?.error || json?.message || ""
                    } catch {
                      // ignore
                    }
                    throw new Error(detail || `HTTP ${res.status}`)
                  }

                  setStatus("success")
                  setSubmitted(true)
                  form.reset()
                } catch (err: any) {
                  setStatus("error")
                  setErrorMessage(
                    `Échec d’envoi. ${
                      err?.message ? String(err.message) : "Réessaie."
                    }`
                  )
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frenchUni">Université française concernée</Label>
                <Input id="frenchUni" name="frenchUni" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerUni">Université partenaire</Label>
                <Input id="partnerUni" name="partnerUni" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="type">Type d’information proposée</Label>
                <Input
                  id="type"
                  name="type"
                  placeholder="ex : conditions d’admission, frais, places, lien officiel…"
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Ajoute les informations exactes + la source."
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="source">Lien source</Label>
                <Input
                  id="source"
                  name="source"
                  type="url"
                  placeholder="https://…"
                />
              </div>
              <input type="hidden" name="page" value="Submit information" />
              <div className="sm:col-span-2 flex items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  Les messages sont envoyés par email (Formspree). Rien n’est stocké sur le site.
                </div>
                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Envoi…" : "Envoyer"}
                </Button>
              </div>
              {status === "error" ? (
                <div className="sm:col-span-2 rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                  {errorMessage}
                </div>
              ) : null}
            </form>
          )}
        </CardContent>
      </Card>
    </PageShell>
  )
}
