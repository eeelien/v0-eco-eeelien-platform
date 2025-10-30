"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock } from "lucide-react"

interface KYCBadgeProps {
  status: "verified" | "pending" | "unverified"
  size?: "sm" | "md"
}

export function KYCBadge({ status, size = "md" }: KYCBadgeProps) {
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4"

  if (status === "verified") {
    return (
      <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1">
        <CheckCircle2 className={iconSize} />
        {size === "md" && "Verificado"}
      </Badge>
    )
  }

  if (status === "pending") {
    return (
      <Badge variant="secondary" className="bg-accent/10 text-accent border-0 gap-1">
        <Clock className={iconSize} />
        {size === "md" && "Pendiente"}
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 gap-1">
      <AlertCircle className={iconSize} />
      {size === "md" && "Sin Verificar"}
    </Badge>
  )
}
