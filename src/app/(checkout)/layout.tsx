import { CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { CheckoutFooter } from "@/components/layout/CheckoutFooter";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <CheckoutHeader />
      <main className="flex-1 bg-gray-50">{children}</main>
      <CheckoutFooter />
    </div>
  );
}
