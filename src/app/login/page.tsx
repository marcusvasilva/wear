"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Tab = "login" | "register";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerCpf, setRegisterCpf] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha incorretos");
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          cpf: registerCpf,
          phone: registerPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar conta");
        setIsLoading(false);
        return;
      }

      // Auto-login after registration
      const loginResult = await signIn("credentials", {
        email: registerEmail,
        password: registerPassword,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("Conta criada, mas houve erro no login automatico. Faca login manualmente.");
        setActiveTab("login");
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Minha Conta</h1>

            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setError("");
                }}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                  activeTab === "login"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  setError("");
                }}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                  activeTab === "register"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {activeTab === "login" ? (
              <>
                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-border rounded-lg px-4 py-3 text-sm font-medium text-text hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                    />
                    <path
                      fill="#34A853"
                      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                    />
                    <path
                      fill="#EA4335"
                      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.462.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                    />
                  </svg>
                  Entrar com Google
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-text-muted">ou</span>
                  </div>
                </div>

                {/* Credentials Login */}
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium mb-1.5">
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium mb-1.5">
                      Senha
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="Sua senha"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </button>
                </form>
              </>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="register-name" className="block text-sm font-medium mb-1.5">
                    Nome completo
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium mb-1.5">
                    Email
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium mb-1.5">
                    Senha
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    required
                    minLength={6}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Minimo 6 caracteres"
                  />
                </div>
                <div>
                  <label htmlFor="register-cpf" className="block text-sm font-medium mb-1.5">
                    CPF
                  </label>
                  <input
                    id="register-cpf"
                    type="text"
                    required
                    value={registerCpf}
                    onChange={(e) => setRegisterCpf(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label htmlFor="register-phone" className="block text-sm font-medium mb-1.5">
                    Telefone
                  </label>
                  <input
                    id="register-phone"
                    type="tel"
                    required
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-text-muted mt-6">
            Ao continuar, voce concorda com nossos{" "}
            <Link href="/termos" className="underline hover:text-text">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="underline hover:text-text">
              Politica de Privacidade
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
