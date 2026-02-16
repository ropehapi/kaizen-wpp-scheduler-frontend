import { AlertCircle } from "lucide-react";

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <AlertCircle className="w-12 h-12 mb-3 text-destructive/60" />
      <p className="text-lg font-medium">Ocorreu um erro</p>
      <p className="text-sm">{message || "Tente novamente mais tarde."}</p>
    </div>
  );
}
