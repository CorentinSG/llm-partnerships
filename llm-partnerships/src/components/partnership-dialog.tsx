"use client"

import * as React from "react"
import type { ReactNode } from "react"

import { useLanguage } from "@/components/language-provider"
import { PartnershipDetails } from "@/components/partnership-details"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Partnership } from "@/lib/types"

export function PartnershipDialog({
  partnership,
  children,
}: {
  partnership: Partnership
  children: ReactNode
}) {
  const { language } = useLanguage()
  const title = {
    fr: "Détails du partenariat",
    en: "Partnership details",
    es: "Detalles del convenio",
  }[language]

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {partnership.frenchUniversity} • {partnership.partnerUniversity}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70dvh] overflow-auto pr-1">
          <PartnershipDetails partnership={partnership} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
