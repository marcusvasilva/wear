import { Download, FileText } from "lucide-react";
import { modelos } from "@/data/products";

export function GabaritoSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">Recursos</h2>
        <p className="text-sm text-text-muted mb-8">
          Baixe os gabaritos para criar sua arte no formato correto
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modelos.map((modelo) => (
            <a
              key={modelo.id}
              href={modelo.gabaritoUrl}
              download
              className="flex items-center gap-3 p-4 border border-border rounded-xl hover:border-primary hover:bg-primary-light transition-all group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center">
                <FileText size={20} className="text-text-muted group-hover:text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text">Gabarito {modelo.nome}</p>
                <p className="text-xs text-text-muted">PDF para download</p>
              </div>
              <Download size={16} className="text-text-muted group-hover:text-primary" />
            </a>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue/5 border border-blue/20 rounded-xl">
          <p className="text-sm text-text">
            <span className="font-semibold">Dica:</span> A arte pode ser enviada após a compra por e-mail ou WhatsApp.
            Não se preocupe em ter a arte pronta agora!
          </p>
        </div>
      </div>
    </section>
  );
}
