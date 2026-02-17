import { useSchedulesList } from "@/hooks/useSchedules";
import { PageLoading } from "@/components/PageLoading";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ScheduleStatus } from "@/types/api";

const statCards: { label: string; status: ScheduleStatus | "all"; icon: React.ElementType; color: string }[] = [
  { label: "Total", status: "all", icon: CalendarClock, color: "text-primary" },
  { label: "Agendados", status: "scheduled", icon: Clock, color: "text-info" },
  { label: "Enviados", status: "sent", icon: CheckCircle2, color: "text-success" },
  { label: "Cancelados", status: "canceled", icon: XCircle, color: "text-destructive" },
];

export default function Dashboard() {
  const { data, isLoading, error } = useSchedulesList({ limit: 5 });
  const { data: scheduledData } = useSchedulesList({ status: "scheduled", limit: 1 });
  const { data: sentData } = useSchedulesList({ status: "sent", limit: 1 });
  const { data: canceledData } = useSchedulesList({ status: "canceled", limit: 1 });

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorState message={(error as Error).message} />;

  const schedules = data?.data || [];

  const counts = {
    all: data?.pagination?.total || 0,
    scheduled: scheduledData?.pagination?.total || 0,
    sent: sentData?.pagination?.total || 0,
    canceled: canceledData?.pagination?.total || 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral dos agendamentos</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.status}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{counts[s.status]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent schedules */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Últimos agendamentos</CardTitle>
          <Link
            to="/schedules"
            className="text-sm text-primary font-medium hover:underline"
          >
            Ver todos →
          </Link>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              Nenhum agendamento ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {schedules.map((s) => (
                <Link
                  key={s.id}
                  to={`/schedules/${s.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{s.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.contacts?.length || 0} contato(s) •{" "}
                      {s.scheduledAt
                        ? format(new Date(s.scheduledAt), "dd MMM yyyy, HH:mm", { locale: ptBR })
                        : "—"}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
