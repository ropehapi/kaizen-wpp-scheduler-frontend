import { useParams, useNavigate } from "react-router-dom";
import { useScheduleById, useCancelSchedule } from "@/hooks/useSchedules";
import { PageLoading } from "@/components/PageLoading";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Pencil, Ban } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ScheduleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useScheduleById(id!);
  const cancelMutation = useCancelSchedule();

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorState message={(error as Error).message} />;

  const schedule = data?.data;
  if (!schedule) return <ErrorState message="Agendamento não encontrado" />;

  const fmt = (d: string) => {
    try {
      return format(new Date(d), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return d;
    }
  };

  const typeLabel = schedule.type === "recurring"
    ? `Recorrente (${schedule.frequency || "—"})`
    : "Único";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detalhes do Agendamento</h1>
            <p className="text-xs text-muted-foreground font-mono">{schedule.id}</p>
          </div>
        </div>
        {schedule.status === "scheduled" && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/schedules/${id}/edit`)}>
              <Pencil className="w-4 h-4 mr-2" /> Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate(id!, { onSuccess: () => navigate("/schedules") })}
              disabled={cancelMutation.isPending}
            >
              <Ban className="w-4 h-4 mr-2" /> Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Status"><StatusBadge status={schedule.status} /></Row>
            <Row label="Tipo">{typeLabel}</Row>
            <Row label="Data de envio">{fmt(schedule.scheduledAt)}</Row>
            <Row label="Criado em">{fmt(schedule.createdAt)}</Row>
            <Row label="Atualizado em">{fmt(schedule.updatedAt)}</Row>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg">{schedule.message}</p>
          </CardContent>
        </Card>
      </div>

      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Contatos ({schedule.contacts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedule.contacts && schedule.contacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.contacts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum contato.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}
