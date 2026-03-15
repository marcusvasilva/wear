import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Wind Banner Personalizado | Wear Sublimações",
  description:
    "Configure e compre seu Wind Banner personalizado com sublimação de alta resolução. Envio em até 48h úteis. Parcelamento em até 6x sem juros.",
  keywords: [
    "wind banner personalizado",
    "wind banner sublimado",
    "bandeira wind banner",
    "wind banner",
    "wear sublimações",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
