import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-xl transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary/12 text-primary shadow-[0_1px_0_rgba(255,255,255,0.5)]",
        secondary:
          "border-accent/25 bg-accent/12 text-foreground shadow-[0_1px_0_rgba(255,255,255,0.5)]",
        outline: "glass-button text-foreground",
        muted:
          "border-white/20 bg-muted/30 text-muted-foreground shadow-[0_1px_0_rgba(255,255,255,0.35)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
