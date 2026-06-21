import { notFound } from "next/navigation";

// Página "Produtos & Preços" temporariamente DESATIVADA.
// O catálogo/preços é gerenciado por enquanto via banco/código (não pela tela).
// Para reativar, restaure a implementação anterior:
//   git checkout 6d76ffb -- "src/app/(admin)/admin/produtos/page.tsx"
// e descomente o link "Produtos" em src/app/(admin)/layout.tsx.
export default function ProdutosPage() {
  notFound();
}
