import { Inbox } from "lucide-react";

export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Inbox className="w-12 h-12 mb-3 opacity-40" />
      <p className="text-lg font-medium">Nada por aqui</p>
      <p className="text-sm">{message || "Nenhum registro encontrado."}</p>
    </div>
  );
}
