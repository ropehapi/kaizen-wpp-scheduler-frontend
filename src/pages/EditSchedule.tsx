import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useScheduleById, useUpdateSchedule } from "@/hooks/useSchedules";
import { useParams, useNavigate } from "react-router-dom";
import { PageLoading } from "@/components/PageLoading";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(100),
  phone: z.string().trim().min(1, "Telefone obrigatório").max(20),
});

const formSchema = z
  .object({
    message: z.string().trim().min(1, "Mensagem obrigatória").max(5000),
    scheduledAt: z.date({ required_error: "Data obrigatória" }),
    scheduledTime: z.string().min(1, "Horário obrigatório"),
    type: z.enum(["once", "recurring"]),
    frequency: z.enum(["daily", "weekly", "monthly"]).optional(),
    contacts: z.array(contactSchema).min(1, "Adicione pelo menos 1 contato"),
  })
  .refine(
    (data) => data.type !== "recurring" || !!data.frequency,
    { message: "Frequência obrigatória para recorrente", path: ["frequency"] }
  );

type FormValues = z.infer<typeof formSchema>;

export default function EditSchedule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useScheduleById(id!);
  const updateMutation = useUpdateSchedule();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      type: "once",
      scheduledTime: "09:00",
      contacts: [{ name: "", phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const schedule = data?.data;

  useEffect(() => {
    if (schedule) {
      const dt = new Date(schedule.scheduledAt);
      form.reset({
        message: schedule.message,
        scheduledAt: dt,
        scheduledTime: format(dt, "HH:mm"),
        type: schedule.type,
        frequency: schedule.frequency,
        contacts: schedule.contacts?.map((c) => ({ name: c.name, phone: c.phone })) || [{ name: "", phone: "" }],
      });
    }
  }, [schedule, form]);

  const scheduleType = form.watch("type");

  const onSubmit = (values: FormValues) => {
    const [hours, minutes] = values.scheduledTime.split(":").map(Number);
    const dt = new Date(values.scheduledAt);
    dt.setHours(hours, minutes, 0, 0);

    updateMutation.mutate(
      {
        id: id!,
        data: {
          message: values.message,
          scheduledAt: dt.toISOString(),
          type: values.type,
          frequency: values.type === "recurring" ? values.frequency : undefined,
          contacts: values.contacts as { name: string; phone: string }[],
        },
      },
      { onSuccess: () => navigate(`/schedules/${id}`) }
    );
  };

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorState message={(error as Error).message} />;
  if (!schedule) return <ErrorState message="Agendamento não encontrado" />;
  if (schedule.status === "sent") return <ErrorState message="Não é possível editar agendamentos já enviados." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Agendamento</h1>
          <p className="text-muted-foreground text-xs font-mono">{id}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Mensagem</CardTitle></CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Agendamento</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="scheduledTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="once">Único</SelectItem>
                      <SelectItem value="recurring">Recorrente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              {scheduleType === "recurring" && (
                <FormField control={form.control} name="frequency" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Diária</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Contatos</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", phone: "" })}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((f, idx) => (
                <div key={f.id} className="flex items-start gap-3">
                  <FormField control={form.control} name={`contacts.${idx}.name`} render={({ field }) => (
                    <FormItem className="flex-1">
                      {idx === 0 && <FormLabel>Nome</FormLabel>}
                      <FormControl><Input placeholder="Nome" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`contacts.${idx}.phone`} render={({ field }) => (
                    <FormItem className="flex-1">
                      {idx === 0 && <FormLabel>Telefone</FormLabel>}
                      <FormControl><Input placeholder="5511999999999" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className={idx === 0 ? "mt-8" : ""} onClick={() => remove(idx)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
