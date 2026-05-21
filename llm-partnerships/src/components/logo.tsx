import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-5 w-5", className)}
      role="img"
      aria-label="LL.M Partnerships"
    >
      <defs>
        <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="hsl(var(--primary))" />
          <stop offset="1" stopColor="hsl(var(--accent))" />
        </linearGradient>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="10"
            floodColor="rgba(0,0,0,0.22)"
          />
        </filter>
      </defs>

      {/* Outer glass ring */}
      <circle
        cx="24"
        cy="24"
        r="19"
        fill="none"
        stroke="url(#lg)"
        strokeWidth="3.5"
        filter="url(#glow)"
        opacity="0.95"
      />
      {/* Inner subtle ring */}
      <circle
        cx="24"
        cy="24"
        r="14.5"
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.10"
        strokeWidth="2"
      />

      {/* Minimal “pillar + link” motif */}
      <path
        d="M17.5 30.5V18.5c0-1 .8-1.8 1.8-1.8h.6c1 0 1.8.8 1.8 1.8v12c0 1-.8 1.8-1.8 1.8h-.6c-1 0-1.8-.8-1.8-1.8Z"
        fill="hsl(var(--foreground))"
        fillOpacity="0.78"
      />
      <path
        d="M26.1 18.7c.7-.7 1.7-1.1 2.7-1.1h.3c1.1 0 2.1.4 2.8 1.2.7.7 1.1 1.7 1.1 2.8 0 1-.4 2-1.1 2.7l-4.2 4.2c-.7.7-1.7 1.1-2.7 1.1h-.1c-1.1 0-2.1-.4-2.8-1.2l-.1-.1"
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.78"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.9 29.3c-.7.7-1.7 1.1-2.7 1.1h-.3c-1.1 0-2.1-.4-2.8-1.2-.7-.7-1.1-1.7-1.1-2.8 0-1 .4-2 1.1-2.7l4.2-4.2c.7-.7 1.7-1.1 2.7-1.1h.1c1.1 0 2.1.4 2.8 1.2l.1.1"
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.34"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

