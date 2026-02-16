import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schedulesApi } from "@/services/api";
import type {
  ScheduleStatus,
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from "@/types/api";
import { toast } from "@/hooks/use-toast";

export function useSchedulesList(params?: {
  status?: ScheduleStatus;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => schedulesApi.list(params),
  });
}

export function useScheduleById(id: string) {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: () => schedulesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => schedulesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules"] });
      toast({ title: "Agendamento criado com sucesso!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao criar agendamento", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleRequest }) =>
      schedulesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules"] });
      toast({ title: "Agendamento atualizado!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
    },
  });
}

export function useCancelSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => schedulesApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules"] });
      toast({ title: "Agendamento cancelado!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao cancelar", description: err.message, variant: "destructive" });
    },
  });
}
