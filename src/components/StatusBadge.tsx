import type { ScheduleStatus } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<ScheduleStatus, { label: string; className: string }> = {
  scheduled: { label: "Agendado", className: "bg-info/10 text-info border-info/20" },
  sent: { label: "Enviado", className: "bg-success/10 text-success border-success/20" },
  canceled: { label: "Cancelado", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function StatusBadge({ status }: { status: ScheduleStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
