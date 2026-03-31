"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ShoppingBag } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-[72px]">
        <Link href="/">
          <Image
            src="/logos/logo-wear-black.png"
            alt="Wear Sublimacoes"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-text hover:text-primary transition-colors"
                aria-label="Menu do usuario"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {session.user.name || session.user.email}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-1 z-50">
                  <Link
                    href="/meus-pedidos"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-gray-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Meus Pedidos
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-text hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-text hover:text-primary transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}

          <a
            href="#configurador"
            className="bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Comprar
          </a>
        </div>
      </div>
    </header>
  );
}
