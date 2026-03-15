"use client";

interface StepSelectorProps {
  numero: number;
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}

export function StepSelector({ numero, titulo, descricao, children }: StepSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-text flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold">
            {numero}
          </span>
          {titulo}
        </h3>
        {descricao && (
          <p className="text-sm text-text-muted mt-1 ml-9">{descricao}</p>
        )}
      </div>
      <div className="ml-9">
        {children}
      </div>
    </div>
  );
}
