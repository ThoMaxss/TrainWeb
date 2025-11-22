import { Train } from "lucide-react"

interface QRCodeProps {
  ticketId: string
}

export function QRCodePlaceholder({ ticketId }: QRCodeProps) {
  return (
    <div className="relative aspect-square w-full max-w-[200px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect width="200" height="200" className="fill-background" />
        <g className="fill-foreground">
          {/* Corner markers */}
          <rect x="10" y="10" width="50" height="50" />
          <rect x="20" y="20" width="30" height="30" className="fill-background" />
          <rect x="140" y="10" width="50" height="50" />
          <rect x="150" y="20" width="30" height="30" className="fill-background" />
          <rect x="10" y="140" width="50" height="50" />
          <rect x="20" y="150" width="30" height="30" className="fill-background" />
          
          {/* Random pattern blocks */}
          {Array.from({ length: 100 }).map((_, i) => {
            const x = 70 + (i % 10) * 10
            const y = 70 + Math.floor(i / 10) * 10
            const show = Math.random() > 0.5
            return show ? <rect key={i} x={x} y={y} width="8" height="8" /> : null
          })}
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-background p-2 shadow-lg">
          <Train className="h-8 w-8 text-primary" />
        </div>
      </div>
    </div>
  )
}

export function Barcode() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-12">
      <g className="fill-foreground">
        {Array.from({ length: 40 }).map((_, i) => {
          const width = Math.random() > 0.5 ? 3 : 2
          const x = i * 5
          return <rect key={i} x={x} y="5" width={width} height="50" />
        })}
      </g>
    </svg>
  )
}
