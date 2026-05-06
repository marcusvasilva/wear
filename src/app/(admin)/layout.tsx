import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
import { auth, signOut } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-header-bg border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-[64px]">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logos/logo-wear-white.png"
                alt="Wear Sublimacoes"
                width={120}
                height={32}
                className="h-7 w-auto"
              />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck size={14} />
              Painel Admin
            </span>

            <nav className="flex items-center gap-1">
              <Link
                href="/admin/pedidos"
                className="text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Pedidos
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 text-white">
            <span className="hidden sm:inline text-xs text-white/60">
              {session?.user?.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
                aria-label="Sair do painel"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
